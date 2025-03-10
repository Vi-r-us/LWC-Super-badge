import { api, LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";

const BOAT_OBJECT = "Boat__c";

export default class SimilarBoats extends NavigationMixin(LightningElement) {
  // Private
  currentBoat;
  relatedBoats;
  boatId;
  error;

  /**
   * Getter for the boatId
   * The record ID of the boat to show similar boats for.
   * @type {string}
   */
  @api
  get recordId() {
    return this.boatId;
  }
  /**
   * Setter for the boatId
   * The record ID of the boat to show similar boats for.
   * @type {string}
   */
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
  }

  @api
  similarBy;

  /**
   * @description: Wired method to fetch similar boats based on the current boatId and criteria.
   *               Updates the relatedBoats property with the fetched data.
   *               If there's an error, updates the error property with the error details.
   * @param {object} response - Response object from the wired Apex method.
   * @param {array} response.data - List of similar Boat__c records.
   * @param {object} response.error - Error details if the Apex method fails.
   */
  @wire(getSimilarBoats, { boatId: "$boatId", similarBy: "$similarBy" })
  similarBoats({ error, data }) {
    if (data) {
      this.relatedBoats = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
    }
  }

  /**
   * Getter for the title
   * @return {string} The title that displays as the heading for the component.
   *                  The title is based on the similarBy criteria.
   */
  get getTitle() {
    return "Similar boats by " + this.similarBy;
  }

  /**
   * Getter for the noBoats property.
   * Returns true if the relatedBoats list is empty or undefined.
   * Otherwise, returns false.
   * @return {boolean} True if there are no boats, false if there are.
   */
  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }

  /**
   * @description: Handles the boattileclick custom event by navigating to the related
   *               boat's record page.
   * @param {object} event - Event object containing the boatId property.
   * @param {string} event.detail.boatId - The Id of the boat that was clicked.
   */
  openBoatDetailPage(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.detail.boatId,
        objectApiName: BOAT_OBJECT,
        actionName: "view",
      },
    });
  }
}
