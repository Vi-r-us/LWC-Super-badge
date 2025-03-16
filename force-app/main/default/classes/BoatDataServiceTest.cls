/**
 * @description       : Test class for BoatDataService.
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 03-16-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
@isTest
public with sharing class BoatDataServiceTest {

    /**
     * @description       : Test setup method to create test data.
     */
    @testSetup
    static void createData() {
        Test.startTest();
        GenerateData.init();
        Test.stopTest();
    }

    /**
     * @description       : Test method to verify fetching boats with a specific boat type Id.
     */
    @isTest
    static void testGetBoatsWithBoatId() {
        // Fetch boat types for testing
        List<BoatType__c> boatTypes = BoatDataService.getBoatTypes();
        System.assertEquals(false, boatTypes.isEmpty(), 'There are no Boat Type records.');

        // Fetch boats with the first boat type Id
        String boatTypeId = boatTypes.get(0).Id;
        List<Boat__c> boatsToTest = BoatDataService.getBoats(boatTypeId);
        List<Boat__c> boatsWithIdExpected = [SELECT Id FROM Boat__c WHERE BoatType__c = :boatTypeId];
        System.assertEquals(boatsWithIdExpected.size(), boatsToTest.size(), 'The boat query did not return the right amount of boats');
    }

    /**
     * @description       : Test method to verify fetching boats without a specific boat type Id.
     */
    @isTest
    static void testGetBoatsWithoutBoatId() {
        // Fetch all boats
        List<Boat__c> boatsToTest = BoatDataService.getBoats(null);
        List<Boat__c> boatsWithIdExpected = [SELECT Id FROM Boat__c];
        System.assertEquals(boatsWithIdExpected.size(), boatsToTest.size(), 'The boat query did not return the right amount of boats');
    }

    /**
     * @description       : Test method to verify fetching similar boats by length.
     */
    @isTest
    static void testGetSimilarBoatsByLength() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [SELECT Id, Length__c FROM Boat__c LIMIT 1];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Fetch similar boats by length
        List<Boat__c> boatsByLength = BoatDataService.getSimilarBoats(boat.get(0).Id, BoatDataService.LENGTH_TYPE);
        List<Boat__c> boatsByLengthExpected = [
            SELECT Id, Length__c
            FROM Boat__c
            WHERE Id != :boat.get(0).Id
            AND (Length__c >= :boat.get(0).Length__c / 1.2)
            AND (Length__c <= :boat.get(0).Length__c * 1.2)
        ];
        System.assertEquals(boatsByLengthExpected.size(), boatsByLength.size(), 'The query did not return the expected similar boats by length.');
    }

    /**
     * @description       : Test method to verify fetching similar boats by price.
     */
    @isTest
    static void testGetSimilarBoatsByPrice() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [SELECT Id, Price__c FROM Boat__c LIMIT 1];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Fetch similar boats by price
        List<Boat__c> boatsByPrice = BoatDataService.getSimilarBoats(boat.get(0).Id, BoatDataService.PRICE_TYPE);
        List<Boat__c> boatsByPriceExpected = [
            SELECT Id, Price__c
            FROM Boat__c
            WHERE Id != :boat.get(0).Id
            AND (Price__c >= :boat.get(0).Price__c / 1.2)
            AND (Price__c <= :boat.get(0).Price__c * 1.2)
        ];
        System.assertEquals(boatsByPriceExpected.size(), boatsByPrice.size(), 'The query did not return the expected similar boats by price.');
    }

    /**
     * @description       : Test method to verify fetching similar boats by type.
     */
    @isTest
    static void testGetSimilarBoatsByType() {
        // Fetch boat types for testing
        List<BoatType__c> boatTypes = BoatDataService.getBoatTypes();
        System.assertEquals(false, boatTypes.isEmpty(), 'There are no Boat Type records.');

        // Fetch boats with the first boat type Id
        String boatTypeId = boatTypes.get(0).Id;
        List<Boat__c> boatsWithTypeId = BoatDataService.getBoats(boatTypeId);
        System.assertEquals(false, boatsWithTypeId.isEmpty(), 'There are no boats with specified boat Id');

        // Fetch similar boats by type
        List<Boat__c> boatsByType = BoatDataService.getSimilarBoats(boatsWithTypeId.get(0).Id, BoatDataService.TYPE_TYPE);
        System.assertEquals(boatsWithTypeId.size() - 1, boatsByType.size(), 'The similar boats by type query did not return the right amount.');
    }

    /**
     * @description       : Test method to verify fetching similar boats when parent boat is empty.
     */
    @isTest
    static void testGetSimilarBoatsParentBoatEmpty() {
        // Fetch similar boats with null parent boat
        List<Boat__c> emptyBoat = BoatDataService.getSimilarBoats(null, '');
        System.assertEquals(true, emptyBoat.isEmpty(), 'The similar boats should be empty.');
    }

    /**
     * @description       : Test method to verify fetching boat reviews.
     */
    @isTest
    static void testGetBoatReviews() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [SELECT Id, Price__c FROM Boat__c LIMIT 1];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Insert a boat review
        BoatReview__c review = new BoatReview__c(Boat__c = boat.get(0).Id, Comment__c = '', Rating__c = 2);
        insert review;

        // Fetch boat reviews
        List<BoatReview__c> reviews = BoatDataService.getAllReviews(boat.get(0).Id);
        System.assertEquals(1, reviews.size(), 'The reviews were not queried correctly.');
    }

    /**
     * @description       : Test method to verify fetching boats by location.
     */
    @isTest
    static void testGetBoatsByLocation() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [SELECT Id, Geolocation__Latitude__s, Geolocation__Longitude__s, BoatType__r.Id FROM Boat__c LIMIT 1];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Fetch boats by location
        String locationSerial = BoatDataService.getBoatsByLocation(boat.get(0).Geolocation__Latitude__s, boat.get(0).Geolocation__Longitude__s, boat.get(0).BoatType__r.Id);
        List<Object> boatsByLocation = (List<Object>)JSON.deserializeUntyped(locationSerial);
        List<Boat__c> boatsExpected = [
            SELECT Id
            FROM Boat__c
            WHERE BoatType__c = :boat.get(0).BoatType__r.Id
            ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:boat.get(0).Geolocation__Latitude__s, :boat.get(0).Geolocation__Longitude__s), 'mi')
            LIMIT 10
        ];
        System.assertEquals(boatsExpected.size(), boatsByLocation.size(), 'The boats were not queried correctly depending on their location.');
    }
}