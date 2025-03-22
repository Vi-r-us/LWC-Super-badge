/* eslint-disable default-case */
import { LightningElement, api } from "lwc";

/**
 * @description       : A custom multi-slider component that allows users to select a range of values
 *                      using two draggable thumbs (start and end). The component supports dynamic
 *                      min, max, and step values and emits events when the range changes.
 */

const THUMBS = ["start", "end"]; // Names of the thumbs used in the slider

export default class MultiSlider extends LightningElement {
  // Public properties with getters and setters to handle min, max, step, start, and end values
  @api
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = parseFloat(value);
  }

  @api
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = parseFloat(value);
  }

  @api
  get step() {
    return this._step;
  }
  set step(value) {
    this._step = parseFloat(value);
  }

  @api
  get start() {
    return this._start;
  }
  set start(value) {
    this._start = this.setBoundaries(value);
  }

  @api
  get end() {
    return this._end;
  }
  set end(value) {
    this._end = this.setBoundaries(value);
  }

  /**
   * @description       : Calculates the range value (difference between start and end).
   * @returns {number}  : The absolute difference between start and end.
   */
  get rangeValue() {
    return Math.abs(this.end - this.start);
  }

  // Private properties for internal state management
  _max = 100; // Default maximum value
  _min = 0; // Default minimum value
  _step = 1; // Default step value
  _start = 0; // Default start value
  _end = 30; // Default end value
  _startValueInPixels; // Start thumb position in pixels
  _endValueInPixels; // End thumb position in pixels

  // DOM elements
  slider; // The slider element
  sliderRange; // The range element within the slider
  currentThumb; // The currently active thumb element

  currentThumbName; // Name of the currently active thumb ("start" or "end")
  currentThumbPositionX; // X-coordinate of the current thumb's position
  maxRange = 300; // Maximum range in pixels (slider width)

  isMoving = false; // Flag to track if a thumb is being moved
  rendered = false; // Flag to ensure the slider is initialized only once

  /**
   * @description       : Lifecycle hook that runs after the component is rendered.
   *                      Initializes the slider on the first render.
   */
  renderedCallback() {
    if (!this.rendered) {
      this.initSlider();
      this.rendered = true;
    }
  }

  /**
   * @description       : Initializes the slider by setting up the thumbs and range positions.
   */
  initSlider() {
    this.slider = this.template.querySelector(".slider");
    this.sliderRange = this.template.querySelector(".range");
    const thumb = this.template.querySelector(".thumb");

    if (this.slider && thumb) {
      this.maxRange = this.slider.offsetWidth - thumb.offsetWidth; // Calculate the maximum range in pixels
      this._startValueInPixels = this.convertValueToPixels(this.start); // Convert start value to pixels
      this._endValueInPixels = this.convertValueToPixels(this.end); // Convert end value to pixels

      // Ensure thumbs are positioned correctly
      this.setThumb("start", this._startValueInPixels);
      this.setThumb("end", this._endValueInPixels);

      // Set the range bar between the thumbs
      this.setRange(this._startValueInPixels, this._endValueInPixels);
    }
  }

  /**
   * @description       : Ensures the value is within the slider's boundaries (min and max).
   * @param {number} value : The value to be checked.
   * @returns {number}     : The value clamped within the min and max boundaries.
   */
  setBoundaries(value) {
    let _value = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(_value)) {
      return this.min; // Default to min if the value is invalid
    }
    _value = _value < this.min ? this.min : _value; // Clamp to min
    return _value > this.max ? this.max : _value; // Clamp to max
  }

  /**
   * @description       : Converts a value to its equivalent pixel position on the slider.
   * @param {number} value : The value to be converted.
   * @returns {number}     : The pixel position corresponding to the value.
   */
  convertValueToPixels(value) {
    const clampedValue = this.setBoundaries(value); // Ensure the value is within boundaries
    return parseFloat(
      (
        ((clampedValue - this.min) / (this.max - this.min)) *
        this.maxRange
      ).toFixed(2),
    );
  }

  /**
   * @description       : Converts a pixel position to its equivalent value on the slider.
   * @param {number} value : The pixel position to be converted.
   * @param {number} step  : The step value for rounding.
   * @returns {number}     : The value corresponding to the pixel position.
   */
  convertPixelsToValue(value, step = 1) {
    let _value =
      parseFloat((value / this.maxRange) * (this.max - this.min)) + this.min; // Add the min offset
    _value = step > 0 ? Math.round(_value / step) * step : _value; // Round to the nearest step
    return parseFloat(_value.toFixed(2));
  }

  /**
   * @description       : Handles the mouse down event on a thumb to start moving it.
   * @param {Event} event : The mouse down event.
   */
  handleMouseDown(event) {
    const thumbId = event.target.dataset.name;
    if (THUMBS.includes(thumbId)) {
      this.currentThumbName = thumbId;
      this.currentThumb = event.target;
      const startX = event.clientX || event.touches[0].clientX;
      this.currentThumbPositionX =
        startX - this.currentThumb.getBoundingClientRect().left;
      this.toggleActiveThumb(true);
      this.isMoving = true;
    } else {
      event.preventDefault();
    }
  }

  /**
   * @description       : Handles the mouse move event to update the thumb's position.
   * @param {Event} event : The mouse move event.
   */
  onMouseMove(event) {
    if (this.isMoving) {
      const currentX = event.clientX || event.targetTouches[0].clientX;
      let moveX =
        currentX -
        this.currentThumbPositionX -
        this.slider.getBoundingClientRect().left;

      // Ensure moveX is clamped within the slider's boundaries
      moveX = Math.max(0, Math.min(moveX, this.maxRange));

      let moveValue = this.convertPixelsToValue(moveX, this.step);
      moveValue = this.setBoundaries(moveValue); // Clamp the value within boundaries
      moveX = this.convertValueToPixels(moveValue);

      switch (this.currentThumbName) {
        case "start":
          this._startValueInPixels = moveX;
          this._start = moveValue;
          break;
        case "end":
          this._endValueInPixels = moveX;
          this._end = moveValue;
          break;
      }
      this.setThumb(this.currentThumbName, moveX);
      this.setRange(this._startValueInPixels, this._endValueInPixels);
    } else {
      event.preventDefault();
    }
  }

  /**
   * @description       : Handles the mouse up event to stop moving the thumb.
   * @param {Event} event : The mouse up event.
   */
  onMouseUp(event) {
    this.isMoving = false;
    this.toggleActiveThumb(false);
    this.onChangeValue(); // Emit the change event
    event.preventDefault();
  }

  /**
   * @description       : Updates the position of a thumb on the slider.
   * @param {string} thumbName : The name of the thumb ("start" or "end").
   * @param {number} valueInPixels : The pixel position of the thumb.
   */
  setThumb(thumbName, valueInPixels) {
    const thumbs = this.slider.querySelectorAll(".thumb");
    thumbs.forEach((thumb) => {
      if (thumb.dataset.name === thumbName) {
        thumb.style.setProperty("--thumb-left-position", `${valueInPixels}px`);
      }
    });
  }

  /**
   * @description       : Toggles the active state of the current thumb.
   * @param {boolean} toggle : Whether to activate or deactivate the thumb.
   */
  toggleActiveThumb(toggle = true) {
    const color = toggle ? "#bb202d" : "#1b5297"; // Active and inactive colors
    this.currentThumb.style.setProperty("--thumb-active-color", color);
  }

  /**
   * @description       : Updates the range bar between the two thumbs.
   * @param {number} start : The pixel position of the start thumb.
   * @param {number} end   : The pixel position of the end thumb.
   */
  setRange(start, end) {
    const maxThumb = Math.max(start, end);
    const minThumb = Math.min(start, end);
    const width = Math.abs(maxThumb - minThumb);
    this.sliderRange.style.setProperty(
      "--range-left-position",
      `${minThumb}px`,
    );
    this.sliderRange.style.setProperty("--range-width", `${width}px`);
  }

  /**
   * @description       : Dispatches a custom event with the updated range values.
   */
  onChangeValue() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          start: this.start,
          end: this.end,
          range: this.rangeValue,
        },
      }),
    );
  }
}
