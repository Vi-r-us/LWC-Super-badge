// imports
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import getMinMaxValues from "@salesforce/apex/BoatDataService.getMinMaxValues";
import { LightningElement, track, wire } from "lwc";

// import getBoatTypes from the BoatDataService => getBoatTypes method';
export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";
  // Filters toggle
  isFiltersVisible = false;
  // Search term
  searchQueryTerm = "";

  // Price max min range
  priceMaxMinRange = {
    min: undefined,
    max: undefined,
  };
  // Length max min range
  lengthMaxMinRange = {
    min: undefined,
    max: undefined,
  };
  // Year built max min range
  yearBuiltMaxMinRange = {
    min: undefined,
    max: undefined,
  };

  priceRange = {
    min: undefined,
    max: undefined,
  };
  lengthRange = {
    min: undefined,
    max: undefined,
  };
  yearBuiltRange = {
    min: undefined,
    max: undefined,
  };

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
   * Wired method to retrieve the minimum and maximum price values for Boat__c records.
   * Updates the priceMaxMinRange property with the fetched data.
   * If there's an error, the priceMaxMinRange is reset and the error is stored in the error property.
   * @param {object} param.data - Map containing 'min' and 'max' price values for Boat__c
   * @param {object} param.error - Error details if the Apex method fails
   */
  @wire(getMinMaxValues, { objectName: "Boat__c", fieldName: "Price__c" })
  wiredPriceMinMaxValues({ error, data }) {
    if (data) {
      this.priceMaxMinRange = { ...data };
      this.priceRange = { ...data };
    } else if (error) {
      this.priceMaxMinRange = { min: undefined, max: undefined };
      this.error = error;
    }
  }

  /**
   * Wired method to retrieve the minimum and maximum length values for Boat__c records.
   * Updates the lengthMaxMinRange property with the fetched data.
   * If there's an error, the lengthMaxMinRange is reset and the error is stored in the error property.
   * @param {object} param.data - Map containing 'min' and 'max' length values for Boat__c
   * @param {object} param.error - Error details if the Apex method fails
   */
  @wire(getMinMaxValues, { objectName: "Boat__c", fieldName: "Length__c" })
  wiredLengthMinMaxValues({ error, data }) {
    if (data) {
      this.lengthMaxMinRange = { ...data };
      this.lengthRange = { ...data };
    } else if (error) {
      this.lengthMaxMinRange = { min: undefined, max: undefined };
      this.error = error;
    }
  }

  /**
   * Wired method to retrieve the minimum and maximum year built values for Boat__c records.
   * Updates the yearBuiltMaxMinRange property with the fetched data.
   * If there's an error, the yearBuiltMaxMinRange is reset and the error is stored in the error property.
   * @param {object} param.data - Map containing 'min' and 'max' year built values for Boat__c
   * @param {object} param.error - Error details if the Apex method fails
   */
  @wire(getMinMaxValues, { objectName: "Boat__c", fieldName: "Year_Built__c" })
  wiredYearBuiltMinMaxValues({ error, data }) {
    if (data) {
      this.yearBuiltMaxMinRange = { ...data };
      this.yearBuiltRange = { ...data };
    } else if (error) {
      this.yearBuiltMaxMinRange = { min: undefined, max: undefined };
      this.error = error;
    }
  }

  /**
   * Handles the toggle button click event to show/hide the filters
   * Toggles the isFiltersVisible property
   */
  handleFiltersToggle() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  /**
   * Handles a change in the search options dropdown
   * @param {object} event event with the detail of the selected value
   * Triggers a custom search event with the selected boatTypeId
   */
  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;
    this.dispatchSearchEvent();
  }

  /**
   * Handles the keyup event of the search input element.
   * Checks if the pressed key is the Enter key and if so, updates the
   * searchQueryTerm property with the value of the input element.
   * @param {object} event - the event object containing the key code
   */
  handleSearchInputKeyUp(event) {
    const isEnterKey = event.keyCode === 13;
    if (!isEnterKey) {
      return;
    }

    if (isEnterKey) {
      this.searchQueryTerm = event.target.value;
    }
    this.dispatchSearchEvent();
  }

  handlePriceChange(event) {
    this.priceRange = {
      min: event.detail.min,
      max: event.detail.max,
    };
    this.dispatchSearchEvent();
  }

  handleLengthChange(event) {
    this.lengthRange = {
      min: event.detail.min,
      max: event.detail.max,
    };
    this.dispatchSearchEvent();
  }

  handleYearBuiltChange(event) {
    this.yearBuiltRange = {
      min: event.detail.min,
      max: event.detail.max,
    };
    this.dispatchSearchEvent();
  }

  dispatchSearchEvent() {
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    const searchEvent = new CustomEvent("search", {
      detail: {
        boatSearchTerm: this.searchQueryTerm,
        boatTypeId: this.selectedBoatTypeId,
        boatPriceRange: this.priceRange,
        boatLengthRange: this.lengthRange,
        boatYearBuiltRange: this.yearBuiltRange,
      },
    });

    this.dispatchEvent(searchEvent);
  }
}
