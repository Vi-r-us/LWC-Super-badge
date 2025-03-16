/**
 * @description       : Test class for SimilarBoatsController.
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             :
 * @last modified on  : 03-16-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 **/
@isTest
public with sharing class SimilarBoatsControllerTest {
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
     * @description       : Test method to verify the getSimilarBoats method by length.
     */
    @isTest
    static void testGetSimilarBoatsByLength() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [
            SELECT Id, Length__c, Price__c, Year_Built__c
            FROM Boat__c
            LIMIT 1
        ];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Initialize the controller with the fetched boat details
        SimilarBoatsController controller = new SimilarBoatsController(
            boat.get(0).Id,
            (Integer) boat.get(0).Length__c,
            (Double) boat.get(0).Price__c,
            (Integer) boat.get(0).Year_Built__c
        );

        // Fetch similar boats using the controller method
        List<Boat__c> boatsByLength = controller.getSimilarBoats();

        // Expected similar boats based on the query
        List<Boat__c> boatsByLengthExpected = [
            SELECT Id, Length__c
            FROM Boat__c
            WHERE
                Id != :boat.get(0).Id
                AND Length__c >= :boat.get(0).Length__c / 1.2
                AND Length__c <= :boat.get(0).Length__c * 1.2
        ];

        // Assert that the fetched similar boats match the expected results
        System.assertEquals(
            boatsByLengthExpected.size(),
            boatsByLength.size(),
            'The query did not return the expected similar boats by length.'
        );
    }

    /**
     * @description       : Test method to verify the Visualforce page controller.
     */
    @isTest
    static void testVisualForcePageController() {
        // Fetch a boat record for testing
        List<Boat__c> boat = [
            SELECT Id, Length__c, Price__c, Year_Built__c
            FROM Boat__c
            LIMIT 1
        ];
        System.assertEquals(1, boat.size(), 'There are no boats inserted.');

        // Set the current page to the Visualforce page and set the boat Id parameter
        PageReference pageRef = Page.SimilarBoats;
        Test.setCurrentPage(pageRef);
        ApexPages.currentPage().getParameters().put('id', boat.get(0).Id);

        // Initialize the controller with the Visualforce page parameters
        SimilarBoatsController controller = new SimilarBoatsController();
    }
}
