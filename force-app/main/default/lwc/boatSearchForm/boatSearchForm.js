// imports
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import { LightningElement, track, wire } from "lwc";

// import getBoatTypes from the BoatDataService => getBoatTypes method';
export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";
  // Filters toggle
  isFiltersVisible = false;
  // Search term
  searchQueryTerm = "";

  // Private
  error = undefined;

  // Search options to be used in the combobox
  @track
  searchOptions;

  /**
   * Gets the list of boat types from the BoatDataService
   * and populates the searchOptions property.
   * If there is an error, the error is stored in the
   * component's error property.
   * @param {object} param.error - error encountered while getting boat types
   * @param {object} param.data - list of boat types
   */
  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map((type) => {
        return {
          label: type.Name,
          value: type.Id,
        };
      });
      this.searchOptions.unshift({ label: "All Types", value: "" });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }

  /**
   * Handles a change in the search options dropdown
   * @param {object} event event with the detail of the selected value
   * Triggers a custom search event with the selected boatTypeId
   */
  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    const searchEvent = new CustomEvent("search", {
      detail: {
        boatTypeId: this.selectedBoatTypeId,
      },
    });
    this.dispatchEvent(searchEvent);
  }

  
  /**
   * Handles the toggle button click event to show/hide the filters
   * Toggles the isFiltersVisible property
   */
  handleFiltersToggle() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  /**
   * Handles the keyup event of the search input element.
   * Checks if the pressed key is the Enter key and if so, updates the
   * searchQueryTerm property with the value of the input element.
   * @param {object} event - the event object containing the key code
   */
  handleSearchInputKeyUp(event) {
    const isEnterKey = event.keyCode === 13;
    if (isEnterKey) {
      this.searchQueryTerm = event.target.value;
    }
  }
}
