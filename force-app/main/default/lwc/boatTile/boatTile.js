/* eslint-disable @lwc/lwc/no-api-reassignments */
// imports
import { api, LightningElement } from "lwc";

const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

export default class BoatTile extends LightningElement {
  @api
  boat;

  @api
  selectedBoatId;

  /**
   * Getter for dynamically setting the background image for the picture
   *
   * @return {string} the background style for the tile
   */
  get backgroundStyle() {
    return "background-image:url(" + this.boat.Picture__c + ")";
  }

  /**
   * Getter for dynamically setting the tile class based on whether the
   * Determines the CSS class for the tile based on the selection state.
   *
   * @return {string} - Returns 'tile-wrapper selected' if the boat is selected,
   *                    otherwise returns 'tile-wrapper'.
   */
  get tileClass() {
    if (this.boat.Id === this.selectedBoatId) {
      return TILE_WRAPPER_SELECTED_CLASS;
    }
    return TILE_WRAPPER_UNSELECTED_CLASS;
  }

  /**
   * Selects the current boat by firing a "boatselect" custom event
   * with the boat's Id in the detail property.
   * Fires event with the Id of the boat that has been selected.
   */
  selectBoat() {
    this.selectedBoatId = this.boat.Id;
    const boatselect = new CustomEvent("boatselect", {
      detail: {
        boatId: this.selectedBoatId,
      },
    });
    this.dispatchEvent(boatselect);
  }
}
