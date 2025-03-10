import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
// import BOATMC from the message channel
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext,
} from "lightning/messageService";

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
const LONGITUDE_FIELD = "Boat__c.Geolocation__Longitude__s";
// Declare the const LATITUDE_FIELD for the boat's Latitude
const LATITUDE_FIELD = "Boat__c.Geolocation__Latitude__s";
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  boatId;

  /**
   * Getter method for the recordId
   * This property is required and is used to display the boat's location on the map.
   * @type {string}
   */
  @api
  get recordId() {
    return this.boatId;
  }

  /**
   * Setter method for the recordId
   * Updates the boatId and sets the attribute "boatId" with the new value.
   * This property is used to update the boat's location on the map.
   *
   * @param {string} value - The new recordId value to set for the boat.
   */
  set recordId(value) {
    this.setAttribute("boatId", value);
    this.boatId = value;
  }

  error = undefined;
  mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;

  /**
   * Wired method to get the record's location to construct map markers using recordId.
   * If the record is found, it will update the map markers.
   * If the record is not found, it will reset the boatId and mapMarkers.
   * @param {object} param - Response from the wired function
   * @param {object} param.data - Record that was retrieved
   * @param {object} param.error - Error returned from the Apex method
   */
  @wire(getRecord, { recordId: "$boatId", fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  /**
   * Subscribes to the Boat Message Channel to receive updates on the selected boat's recordId.
   *
   * The subscription ensures that the component updates its boatId property whenever a new
   * recordId is published on the channel, as long as the component is not on a record page
   * (i.e., recordId is not already set) and has not already subscribed. The subscription is
   * performed within the application scope.
   */
  subscribeMC() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
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

  /**
   * Subscribe to the message channel when the component is inserted into the DOM.
   * This allows the component to receive the recordId when it is sent from the
   * BoatSearchResults component.
   */
  connectedCallback() {
    // Calls subscribeMC()
    this.subscribeMC();
  }

  /**
   * Creates the map markers array with the current boat's location for the map.
   *
   * @param {number} Longitude - The longitude of the location to be marked on the map.
   * @param {number} Latitude - The latitude of the location to be marked on the map.
   */
  updateMap(Longitude, Latitude) {
    this.mapMarkers = [{ location: { Latitude, Longitude } }];
  }

  /**
   * Getter method that determines if the map component is displayed.
   * @returns {boolean} whether the map component should be displayed
   */
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}
