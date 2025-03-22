/**
 * @description       : Provides various methods to retrieve and manage Boat and BoatType data.
 *                      Includes methods to get boats, similar boats, boat types, and boat reviews.
 *                      Also includes a method to update a list of boats and get boats by location.
 *                      All queries enforce field-level security.
 * @author            : Sahil K
 * @group             :
 * @last modified on  : 03-22-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 **/
public with sharing class BoatDataService {
    public static final String LENGTH_TYPE = 'Length';
    public static final String PRICE_TYPE = 'Price';
    public static final String TYPE_TYPE = 'Type';

    // TODO: Change the docstring
    /**
     * @description       : Retrieves a list of Boat__c records based on the provided boatTypeId.
     *                      If no boatTypeId is provided, it retrieves all Boat__c records.
     *                      The query enforces field-level security.
     * @param boatTypeId  : The Id of the BoatType__c to filter the boats by.
     * @return            : A list of Boat__c records.
     * @example           : List<Boat__c> boats = BoatDataService.getBoats('a0123456789ABC');
     **/
    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(
        String boatSearchTerm,
        String boatTypeId
    ) {
        String searchTerm = boatSearchTerm + '%';
        // Without an explicit boatTypeId, the full list is desired
        String query =
            'SELECT ' +
            'Name, Description__c, Geolocation__Latitude__s, ' +
            'Geolocation__Longitude__s, Picture__c, Contact__r.Name, ' +
            'BoatType__c, BoatType__r.Name, Length__c, Price__c ' +
            'FROM Boat__c';
        if (String.isNotBlank(boatSearchTerm)) {
            query += ' WHERE Name LIKE :searchTerm';
        }
        if (String.isNotBlank(boatTypeId)) {
            if (String.isNotBlank(boatSearchTerm)) {
                query += ' AND';
            } else {
                query += ' WHERE';
            }
            query += ' BoatType__c = :boatTypeId';
        }
        query += ' WITH SECURITY_ENFORCED ';
        return Database.query(query);
    }

    /**
     * @description       : Retrieves a list of similar Boat__c records based on the provided boatId and similarity criteria.
     *                      The query enforces field-level security.
     * @param boatId      : The Id of the Boat__c to find similar boats for.
     * @param similarBy   : The criteria to find similar boats by (Length, Price, or Type).
     * @return            : A list of similar Boat__c records.
     * @example           : List<Boat__c> similarBoats = BoatDataService.getSimilarBoats('a0123456789ABC', 'Length');
     **/
    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy) {
        List<Boat__c> similarBoats = new List<Boat__c>();
        List<Boat__c> parentBoat = [
            SELECT Id, Length__c, Price__c, BoatType__c, BoatType__r.Name
            FROM Boat__c
            WHERE Id = :boatId
            WITH SECURITY_ENFORCED
        ];
        if (parentBoat.isEmpty()) {
            return similarBoats;
        }
        if (similarBy == LENGTH_TYPE) {
            similarBoats = [
                SELECT
                    Id,
                    Contact__r.Name,
                    Name,
                    BoatType__c,
                    BoatType__r.Name,           
                    Length__c,
                    Picture__c,
                    Price__c,
                    Year_Built__c
                FROM Boat__c
                WHERE
                    Id != :parentBoat.get(0).Id
                    AND Length__c >= :parentBoat.get(0).Length__c / 1.2
                    AND Length__c <= :parentBoat.get(0).Length__c * 1.2
                WITH SECURITY_ENFORCED
                ORDER BY Length__c, Price__c, Year_Built__c
            ];
        } else if (similarBy == PRICE_TYPE) {
            similarBoats = [
                SELECT
                    Id,
                    Contact__r.Name,
                    Name,
                    BoatType__c,
                    BoatType__r.Name,
                    Length__c,
                    Picture__c,
                    Price__c,
                    Year_Built__c
                FROM Boat__c
                WHERE
                    Id != :parentBoat.get(0).Id
                    AND Price__c >= :parentBoat.get(0).Price__c / 1.2
                    AND Price__c <= :parentBoat.get(0).Price__c * 1.2
                WITH SECURITY_ENFORCED
                ORDER BY Price__c, Length__c, Year_Built__c
            ];
        } else if (similarBy == TYPE_TYPE) {
            similarBoats = [
                SELECT
                    Id,
                    Contact__r.Name,
                    Name,
                    BoatType__c,
                    BoatType__r.Name,
                    Length__c,
                    Picture__c,
                    Price__c,
                    Year_Built__c
                FROM Boat__c
                WHERE
                    Id != :parentBoat.get(0).Id
                    AND BoatType__c = :parentBoat.get(0).BoatType__c
                WITH SECURITY_ENFORCED
                ORDER BY Price__c, Length__c, Year_Built__c
            ];
        }
        return similarBoats;
    }

    /**
     * @description       : Retrieves a list of BoatType__c records.
     *                      The results are cached for better performance.
     *                      The query enforces field-level security and orders the results by Name.
     * @return            : A list of BoatType__c records.
     * @example           : List<BoatType__c> boatTypes = BoatDataService.getBoatTypes();
     **/
    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes() {
        return [
            SELECT Name, Id
            FROM BoatType__c
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }

    /**
     * @description       : Retrieves the minimum and maximum values of a field from a given object.
     *                      The query enforces field-level security.
     * @param objectName  : The name of the object to query.
     * @param fieldName   : The name of the field to retrieve the minimum and maximum values for.
     * @return            : A map containing the minimum and maximum values of the field.
     * @example           : Map<String, Decimal> minMaxValues = BoatDataService.getMinMaxValues('Boat__c', 'Length__c');
     **/
    @AuraEnabled (cacheable=true)
    public static Map<String, Decimal> getMinMaxValues(
        String objectName,
        String fieldName
    ) {
        Map<String, Decimal> minMaxValues = new Map<String, Decimal>();
        String query = 'SELECT MIN(' + fieldName + ') min, MAX(' + fieldName + ') max FROM ' + objectName + ' WITH SECURITY_ENFORCED';
        List<AggregateResult> results = Database.query(query);
        if (!results.isEmpty()) {
            minMaxValues.put('min', (Decimal) results[0].get('min'));
            minMaxValues.put('max', (Decimal) results[0].get('max'));
        }
        return minMaxValues;
    }
    

    /**
     * @description       : Retrieves a list of BoatReview__c records for a given boatId.
     *                      The query enforces field-level security and orders the results by CreatedDate in descending order.
     * @param boatId      : The Id of the Boat__c to retrieve reviews for.
     * @return            : A list of BoatReview__c records.
     * @example           : List<BoatReview__c> reviews = BoatDataService.getAllReviews('a0123456789ABC');
     **/
    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(Id boatId) {
        return [
            SELECT
                Id,
                Name,
                Comment__c,
                Rating__c,
                LastModifiedDate,
                CreatedDate,
                CreatedBy.Name,
                CreatedBy.SmallPhotoUrl,
                CreatedBy.CompanyName
            FROM BoatReview__c
            WHERE Boat__c = :boatId
            WITH SECURITY_ENFORCED
            ORDER BY CreatedDate DESC
        ];
    }

    // Assume this may be an API that return this data, not a SOQL query
    /**
     * @description       : Retrieves a list of Boat__c records based on the provided location and optional boatTypeId.
     *                      The results are cached for better performance.
     *                      The query enforces field-level security and orders the results by distance from the provided location.
     * @param latitude    : The latitude of the location to search from.
     * @param longitude   : The longitude of the location to search from.
     * @param boatTypeId  : (Optional) The Id of the BoatType__c to filter the boats by.
     * @return            : A JSON string representing a list of Boat__c records.
     * @example           : String boats = BoatDataService.getBoatsByLocation(37.7749, -122.4194, 'a0123456789ABC');
     **/
    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(
        Decimal latitude,
        Decimal longitude,
        String boatTypeId
    ) {
        // Without an explicit boatTypeId, the full list is desired
        String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c ';
        if (String.isNotBlank(boatTypeId)) {
            query += 'WHERE BoatType__c = :boatTypeId ';
        }
        query += ' WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
        return JSON.serialize(Database.query(query));
    }

    /**
     * @description       : Updates a list of Boat__c records.
     * @param data        : A JSON string representing a list of Boat__c records to be updated.
     * @return            : A success message indicating the update status.
     * @example           : String result = BoatDataService.updateBoatList(jsonData);
     **/
    @AuraEnabled
    public static String updateBoatList(Object data) {
        List<Boat__c> boatsForUpdate = (List<Boat__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Boat__c>.class
        );

        update boatsForUpdate;
        return 'Success: Boats updated successfully';
    }
}
