// imports
import { api, LightningElement } from "lwc";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import { NavigationMixin } from "lightning/navigation";

export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading;

  /**
   * Getter for the boat Id
   * The record ID of the boat to show reviews for.
   * This property is used to display the boat's details on the form.
   * @type {string}
   */
  get recordId() {
    return this.boatId;
  }

  /**
   * Setter for the boat Id
   * The record ID of the boat to show reviews for.
   * This property is used to display the boat's details on the form.
   * @type {string}
   */
  @api
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.getReviews();
  }

  /**
   * Getter method to determine if there are reviews to display.
   * Determines if there are reviews available to display.
   *
   * @returns {boolean} - Returns true if boatReviews is defined, not null, and contains one or more reviews; otherwise, returns false.
   */
  get reviewsToShow() {
    return (
      this.boatReviews !== undefined &&
      this.boatReviews != null &&
      this.boatReviews.length > 0
    );
  }

  /**
   * Public method to refresh the list of reviews for the current boat.
   *
   * This method calls the getReviews function to retrieve the latest reviews.
   * It can be invoked externally to ensure the displayed reviews are up-to-date.
   */
  @api
  refresh() {
    this.getReviews();
  }

  /**
   * Retrieves reviews for the current boat using the boatId.
   *
   * This method makes an imperative Apex call to fetch all reviews associated with the given boatId.
   * It sets the isLoading flag to true at the beginning of the process and resets it to false upon completion.
   * If the boatId is not provided, the method exits without making any call.
   * When the reviews are successfully retrieved, they are assigned to the boatReviews property and any existing error is cleared.
   * In case of an error, the error property is updated accordingly.
   */
  getReviews() {
    // If the boatId is not provided, the method exits without making any call.
    if (this.boatId) {
      // Sets the isLoading flag to true at the beginning of the process
      this.isLoading = true;
      // Makes an imperative Apex call to fetch all reviews associated with the given boatId.
      getAllReviews({ boatId: this.boatId })
        .then((result) => {
          this.boatReviews = result;
          this.error = undefined;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      return;
    }
  }

  /**
   * Navigates to the user record page.
   *
   * This function is triggered by a click event on an element containing a data-record-id attribute.
   * It prevents the default action and stops event propagation before navigating to the specified user record.
   *
   * @param {Event} event - The click event containing the dataset with recordId.
   */
  navigateToRecord(event) {
    // Prevents the default action and stops event propagation
    event.preventDefault();
    event.stopPropagation();

    // Navigates to the user record page
    const recordId = event.target.dataset.recordId;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        objectApiName: "User",
        actionName: "view",
      },
    });
  }
}
