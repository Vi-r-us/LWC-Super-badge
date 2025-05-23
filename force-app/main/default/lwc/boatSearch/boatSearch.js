// imports
import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;

  /**
   * Shows the loading indicator.
   *
   * This method is called by the BoatSearchForm component when the Apex method
   * is invoked. It shows the spinner and hides the results.
   */
  handleLoading() {
    this.isLoading = true;
  }

  /**
   * Stops the loading indicator.
   *
   * This method is called by the BoatSearchResults component when the Apex method
   * has finished running. It hides the spinner and displays the results.
   */
  handleDoneLoading() {
    this.isLoading = false;
  }

  /**
   * Handles the search boat event.
   *
   * This function is called by the BoatSearchForm component when the user
   * searches for boats. It calls the searchBoats Apex method and shows the spinner.
   *
   * @param {object} event - The search boat event containing the boatTypeId
   * @example - searchBoats('a0123456789ABC');
   */
  searchBoats(event) {
    // Get the value of the search text field
    const boatSearchTerm = event.detail.boatSearchTerm;
    const boatTypeId = event.detail.boatTypeId;
    const boatPriceRange = event.detail.boatPriceRange;
    const boatLengthRange = event.detail.boatLengthRange;
    const boatYearRange = event.detail.boatYearBuiltRange;

    // Call the searchBoats Apex method
    this.template
      .querySelector("c-boat-search-results")
      .searchBoats(
        boatSearchTerm,
        boatTypeId,
        boatPriceRange,
        boatLengthRange,
        boatYearRange,
      );

    // Show the spinner
    this.handleLoading();
  }

  /**
   * Navigate to the record create form
   *
   * This function is called when the user clicks the "New Boat" button.
   * It uses the Navigation Service to redirect the user to the record create form.
   *
   */
  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c",
        actionName: "new",
      },
    });
  }
}
