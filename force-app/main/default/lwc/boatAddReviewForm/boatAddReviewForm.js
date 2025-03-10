import { api, LightningElement } from "lwc";

// imports
import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import NAME_FIELD from "@salesforce/schema/BoatReview__c.Name";
import COMMENT_FIELD from "@salesforce/schema/BoatReview__c.Comment__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Review Created!";
const SUCCESS_VARIANT = "success";

export default class BoatAddReviewForm extends LightningElement {
  // Private
  boatId;
  rating;
  boatReviewObject = BOAT_REVIEW_OBJECT;
  nameField = NAME_FIELD;
  commentField = COMMENT_FIELD;
  labelSubject = "Review Subject";
  labelRating = "Rating";

  /**
   * Getter for recordId
   * The record ID of the boat to add the review to.
   * This property is used to display the boat's details on the form.
   * @type {string}
   */
  @api
  get recordId() {
    return this.boatId;
  }

  /**
   * The record ID of the boat to add the review to.
   * This setter is necessary to allow for logic to run when the recordId changes,
   * as the component is being used in a dynamic form and the recordId is not known
   * until runtime. The setter calls setAttribute to set the attribute on the component,
   * and also assigns the value to the boatId property for use elsewhere in the component.
   * @param {string} value - The record ID of the boat.
   */
  set recordId(value) {
    // sets boatId attribute
    this.setAttribute("boatId", value);
    // sets boatId assignment
    this.boatId = value;
  }

  /**
   * Handles a change in the rating from the stars component.
   *
   * @param {object} event - The event generated when the user selects a new rating.
   * @param {number} event.detail.rating - The new rating value.
   */
  handleRatingChanged(event) {
    this.rating = event.detail.rating;
  }

  /**
   * Custom submission handler to properly set Rating
   * This function must prevent the anchor element from navigating to a URL.
   * @param {Event} event - The event generated when the form is submitted.
   */
  handleSubmit(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    fields.Rating__c = this.rating;
    fields.Boat__c = this.boatId;
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  /**
   * Shows a success toast message and dispatches a custom event when a review is created.
   *
   * This method is called upon successful form submission. It displays a success toast message,
   * resets the form fields, and dispatches a "createreview" custom event to notify that a new review
   * has been created.
   */
  handleSuccess() {
    // Dispatches event when review is created
    const toast = new ShowToastEvent({
      title: SUCCESS_TITLE,
      variant: SUCCESS_VARIANT,
    });
    this.dispatchEvent(toast);

    // Resetting the form fields
    this.handleReset();

    // Dispatching the custom event
    const createReviewEvent = new CustomEvent("createreview");
    this.dispatchEvent(createReviewEvent);
  }

  /**
   * Resets all input fields of the form upon submission
   */
  handleReset() {
    // Get all input fields
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    // If the input fields are obtained, then reset them
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }
}
