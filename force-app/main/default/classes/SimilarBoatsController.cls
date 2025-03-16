/**
 * @description       : Controller class to handle operations related to similar boats.
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             :
 * @last modified on  : 03-16-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 **/
public class SimilarBoatsController {
    // Public properties to hold main boat details
    public Double mainBoatPrice { get; set; }
    public Integer mainBoatLength { get; set; }
    public Integer mainBoatYear { get; set; }
    public Id mainBoatId { get; set; }

    // Visualforce page attribute to hold the boat record
    public Boat__c boat { get; private set; }

    /**
     * @description       : Default constructor to initialize the controller with the boat details from the Visualforce page.
     *                      Fetches the boat record based on the 'id' parameter from the current page.
     */
    public SimilarBoatsController() {
        // Get the boat Id from the current page parameters
        Id boatId = ApexPages.currentPage().getParameters().get('id');
        System.debug('boatId: ' + boatId);

        // Fetch the boat record if the Id is not null, otherwise initialize a new boat record
        boat = (boatId == null)
            ? new Boat__c()
            : [
                  SELECT
                      Id,
                      Name,
                      BoatType__c,
                      Length__c,
                      Picture__c,
                      Price__c,
                      Year_Built__c
                  FROM Boat__c
                  WHERE Id = :boatId
              ];
    }

    /**
     * @description          : Parameterized constructor to initialize the controller with the main boat details.
     * @param mainBoatId     : Id of the main boat.
     * @param mainBoatLength : Length of the main boat.
     * @param mainBoatPrice  : Price of the main boat.
     * @param mainBoatYear   : Year the main boat was built.
     */
    public SimilarBoatsController(
        Id mainBoatId,
        Integer mainBoatLength,
        Double mainBoatPrice,
        Integer mainBoatYear
    ) {
        this.mainBoatLength = mainBoatLength;
        this.mainBoatPrice = mainBoatPrice;
        this.mainBoatYear = mainBoatYear;
        this.mainBoatId = mainBoatId;
    }

    /**
     * @description       : Method to fetch a list of boats similar to the main boat based on length.
     * @return            : List of similar boats.
     */
    public List<Boat__c> getSimilarBoats() {
        // Query to fetch boats similar to the main boat based on length
        List<Boat__c> similarBoatsList = [
            SELECT
                Id,
                Name,
                BoatType__r.Name,
                Length__c,
                Picture__c,
                Price__c,
                Year_Built__c
            FROM Boat__c
            WHERE
                Id != :this.mainBoatId
                AND Length__c >= :this.mainBoatLength / 1.2
                AND Length__c <= :this.mainBoatLength * 1.2
            ORDER BY Length__c, Price__c, Year_Built__c
        ];
        return similarBoatsList;
    }
}
