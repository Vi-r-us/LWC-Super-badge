//import fivestar static resource, call it fivestar
import fivestar from '@salesforce/resourceUrl/fivestar';
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

// add constants here
const ERROR_TITLE = 'Error loading five-star';
const ERROR_VARIANT = 'error';
const EDITABLE_CLASS = 'c-rating';
const READ_ONLY_CLASS = 'readonly c-rating';

export default class FiveStarRating extends LightningElement {
  //initialize public readOnly and value properties
  @api
  readOnly;
  @api
  value;

  editedValue;
  isRendered;
  
  /**
   * A getter that returns the correct class name for the component based on the
   * readOnly property. If readOnly is true, it returns 'readonly c-rating',
   * otherwise it returns 'c-rating'.
   *
   * @returns {string} - Either 'readonly c-rating' or 'c-rating'.
   */
  get starClass() {
    return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  
  /**
   * Lifecycle hook executed after the component is inserted into the DOM.
   *
   * Loads the necessary script for the component if it hasn't been loaded already.
   * Ensures the script is loaded only once by checking the isRendered flag.
   */
  renderedCallback() {
    // Check if the script has already been loaded
    if (this.isRendered) {
      return;
    }
    // Load the script once renderedCallback is called for the first time
    this.loadScript();
    this.isRendered = true;
  }

  
  /**
   * Method to load the 3rd party script and initialize the rating.
   * 
   * Loads the rating.js and rating.css scripts from the static resource,
   * and calls initializeRating() if the load is successful.
   * If there is an error loading the scripts, it displays a toast with the error message.
   */
  loadScript() {
    Promise.all([
      loadScript(this, fivestar + '/rating.js'),
      loadStyle(this, fivestar + '/rating.css')      
    ]).then(() => {
      this.initializeRating();
    })
    .catch(error => {
      const toast = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT,
      });
      this.dispatchEvent(toast);
    });
  }

  
  /**
   * Initializes the rating component
   * @private
   */
  initializeRating() {
    // Initialize if the script has been loaded correctly
    const domEl = this.template.querySelector('ul');
    const maxRating = 5;
    const self = this;

    // initialize the rating control with readOnly property set to readOnly
    // and 5-star rating and callback function set to the ratingChanged function
    const callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };

    // sets the custom rating control
    this.ratingObj = window.rating(
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }
  
  /**
   * Dispatches a custom event with the current rating.
   *
   * This method creates and dispatches a "ratingchange" custom event
   * with the provided rating in the detail property. It is triggered
   * when the user selects a new rating.
   *
   * @param {number} rating - The current rating selected by the user.
   */
  ratingChanged(rating) {     
    // Create the custom event ratingchange. It must be detail: { rating: rating }
    const ratingchangeEvent = new CustomEvent('ratingchange', {
      detail: {
        rating: rating
      }
    });
    this.dispatchEvent(ratingchangeEvent);    
  }
}