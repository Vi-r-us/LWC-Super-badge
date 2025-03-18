/* eslint-disable no-unused-vars */
/* eslint-disable @lwc/lwc/no-api-reassignments */
import { api, LightningElement, track, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";

export default class BoatSearchResults extends LightningElement {
  @api
  selectedBoatId;

  columns = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Length", fieldName: "Length__c", type: "number" },
    { label: "Price", fieldName: "Price__c", type: "currency" },
    { label: "Description", fieldName: "Description__c" },
  ];
  boatSearchTerm = "";
  boatTypeId = "";

  @track
  boats;
  @track
  draftValues = [];

  isLoading = false;

  // Wire message context to listen to messages
  @wire(MessageContext)
  messageContext;

  // TODO: Change the docstring
  /**
   * @description: Wired function to get the list of boats based on the boatTypeId.
   *               When the data is available, it updates the boats property.
   *               If there is an error, it logs the error to the console.
   * @param {object} param - Response from the wired function
   * @param {object} param.data - List of Boat__c records
   * @param {object} param.error - Error returned from the Apex method
   */
  @wire(getBoats, {
    boatSearchTerm: "$boatSearchTerm",
    boatTypeId: "$boatTypeId",
  })
  wiredBoats({ data, error }) {
    if (data) {
      this.boats = data;
    } else if (error) {
      console.log("data.error");
      console.log(error);
    }
  }

  /**
   * Search for boats based on the provided boatTypeId.
   *
   * This function is called by the BoatSearchForm component when the user
   * searches for boats.
   *
   * This method will update the boatTypeId property and call the
   * notifyLoading function to show the spinner.
   *
   * @param {string} boatTypeId - The Id of the boat type to search for.
   * @example
   * searchBoats('a0123456789ABC');
   */
  @api
  searchBoats(boatSearchTerm, boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatSearchTerm = boatSearchTerm;
    this.boatTypeId = boatTypeId;
  }

  /**
   * This function refreshes the boats asynchronously by calling
   * refreshApex. It sets isLoading to true before refreshing the boats
   * and calls notifyLoading to show the spinner.
   *
   * @api
   */
  @api
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  /**
   * Handles the event when a boat tile is selected
   *
   * @param {object} event the ontileselect event containing the boatId
   *
   * Updates selectedBoatId and sends the selected boatId to the Boat Message Channel
   */
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  /**
   * Publishes the selected boat Id to the Boat Message Channel.
   *
   * @param {string} boatId - The Id of the selected boat to be published.
   */
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }

  /**
   * Handle the event when the user clicks the save button
   *
   * @param {object} event the onsave event containing the draft values
   *
   * Show a success message when the save is successful
   * Show an error message when the save fails
   * Clear the draft values
   * Refresh the boats datagrid
   */
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then((result) => {
        const toast = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT,
        });
        this.dispatchEvent(toast);
        this.draftValues = [];
        return this.refresh();
      })
      .catch((error) => {
        const toast = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT,
        });
        this.dispatchEvent(toast);
      })
      .finally(() => {});
  }

  /**
   * Dispatches a custom event indicating the loading state.
   *
   * @param {boolean} isLoading - The current loading state. If true, dispatches a "loading" event; otherwise, dispatches a "doneloading" event.
   */
  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent("loading"));
    } else {
      this.dispatchEvent(CustomEvent("doneloading"));
    }
  }
}
