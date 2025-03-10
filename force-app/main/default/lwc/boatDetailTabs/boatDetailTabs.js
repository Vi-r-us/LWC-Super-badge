import { wire, LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";

// Custom Labels Imports
import labelDetails from "@salesforce/label/c.Details";
import labelReviews from "@salesforce/label/c.Reviews";
import labelAddReview from "@salesforce/label/c.Add_Review";
import labelFullDetails from "@salesforce/label/c.Full_Details";
import labelPleaseSelectABoat from "@salesforce/label/c.Please_select_a_boat";
// Boat__c Schema Imports
import BOAT_ID_FIELD from "@salesforce/schema/Boat__c.Id";
import BOAT_NAME_FIELD from "@salesforce/schema/Boat__c.Name";
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
// import BOATMC from the message channel
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext,
} from "lightning/messageService";

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;
  boatId;

  @wire(getRecord, { recordId: "$boatId", fields: BOAT_FIELDS })
  wiredRecord;

  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  /**
   * Getter method for the icon name
   * Returns the icon name for the details tab.
   * Returns 'utility:anchor' if the boat record is loaded, otherwise null.
   * @returns {string} icon name
   */
  get detailsTabIconName() {
    return this.wiredRecord.data ? "utility:anchor" : null;
  }

  /**
   * Getter method for the boat name
   * Extracts the boat name from the record wire using getFieldValue.
   * The boat name is null if the record wire is not providing data.
   * @returns {string} boat name
   */
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }

  // Private
  subscription = null;

  /**
   * Subscribes to the Boat Message Channel to receive updates on the selected boat's recordId.
   *
   * The subscription ensures that the component updates its boatId property whenever a new
   * recordId is published on the channel, as long as the component is not on a record page
   * (i.e., recordId is not already set) and has not already subscribed. The subscription is
   * performed within the application scope.
   */
  subscribeMC() {
    // local boatId must receive the recordId from the message
    if (this.subscription) {
      return;
    }
    // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
    this.subscription = subscribe(
      this.messageContext,
      BOATMC,
      (message) => {
        this.boatId = message.recordId;
      },
      { scope: APPLICATION_SCOPE },
    );
  }

  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }

  /**
   * Navigates to the record page associated with the current boat.
   *
   * This function is called when the user selects the "View Details" button.
   * It uses the Navigation Service to redirect the user to the record page.
   */
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.boatId,
        objectApiName: "Boat__c",
        actionName: "view",
      },
    });
  }

  /**
   * Handles the event when a review is created.
   *
   * Changes the active tab to the reviews tab and refreshes the reviews component.
   */
  handleReviewCreated() {
    this.template.querySelector("lightning-tabset").activeTabValue = "reviews";
    this.template.querySelector("c-boat-reviews").refresh();
  }
}
