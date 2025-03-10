import { api, LightningElement, wire } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";

export default class BoatsNearMe extends LightningElement {
  @api
  boatTypeId;

  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;

  /**
   * Wired method that gets the list of boats by location from the Apex Class
   * using the latitude, longitude and boatTypeId properties.
   *
   * If the data is available, it calls the createMapMarkers method with the
   * data.
   *
   * If there is an error, it dispatches a toast event with the error message.
   *
   * Finally, it sets isLoading to false.
   *
   * @param {object} param - Response from the wired function
   * @param {object} param.data - List of Boat__c records
   * @param {object} param.error - Error returned from the Apex method
   */
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId",
  })
  wiredBoatsJSON({ error, data }) {
    if (data) {
      // Call the method to create map markers
      this.createMapMarkers(data);
    } else if (error) {
      // Dispatch a toast event with the error message
      const toast = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.message,
        variant: ERROR_VARIANT,
      });
      this.dispatchEvent(toast);
    }
    // Set isLoading to false
    this.isLoading = false;
  }

  /**
   * Lifecycle hook executed when the component is inserted into the DOM.
   *
   * Calls getLocationFromBrowser() to get the user's current location
   * if the component has not been rendered before. Sets the isRendered
   * flag to true after the initial execution to prevent redundant calls.
   */
  renderedCallback() {
    // Get the user's current location if the component has not been rendered before
    if (!this.isRendered) {
      this.getLocationFromBrowser();
    }
    // Set the isRendered flag to true to prevent redundant calls
    this.isRendered = true;
  }

  /**
   * Gets the user's current location from the browser.
   *
   * If the browser supports geolocation, it calls getCurrentPosition() to get the user's
   * current location and sets the latitude and longitude properties with the results.
   *
   * If the browser does not support geolocation, it does nothing.
   */
  getLocationFromBrowser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  /**
   * Creates map markers from the provided boat data and sets them to the mapMarkers property.
   *
   * The method parses the boatData JSON string, extracts the necessary fields for each boat,
   * and constructs an array of marker objects with title and location details. It also prepends
   * a marker representing the user's current location.
   *
   * @param {string} boatData - JSON string representing an array of Boat__c records.
   *                            Each record should have Name, Geolocation__Latitude__s, and Geolocation__Longitude__s fields.
   */
  createMapMarkers(boatData) {
    // Parse the boat data to extract the necessary fields
    const newMarkers = JSON.parse(boatData).map((boat) => {
      return {
        title: boat.Name,
        location: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s,
        },
      };
    });
    // Add the user's current location to the beginning of the array
    newMarkers.unshift({
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER,
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude,
      },
    });
    // Set the mapMarkers with the new markers
    this.mapMarkers = newMarkers;
  }
}
