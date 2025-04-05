import { LightningElement, api } from "lwc";

export default class RangeInput extends LightningElement {
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
    this._start = parseFloat(value);
  }

  @api
  get end() {
    return this._end;
  }
  set end(value) {
    this._end = parseFloat(value);
  }

  _min = 0; // Internal minimum value
  _max = 1000000; // Internal maximum value
  _start = 0; // Internal start value
  _end = 100000; // Internal end value

  /**
   * Handles changes to the start input field.
   * Ensures the value is within the allowed range and dispatches an event with the updated range.
   * @param {Event} event - The input change event.
   */
  handleStartChange(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= this.min && value <= this.end) {
      this._start = value;
      this.dispatchRangeChangeEvent();
    }
  }

  /**
   * Handles changes to the end input field.
   * Ensures the value is within the allowed range and dispatches an event with the updated range.
   * @param {Event} event - The input change event.
   */
  handleEndChange(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= this.start && value <= this.max) {
      this._end = value;
      this.dispatchRangeChangeEvent();
    }
  }

  /**
   * Dispatches a custom event with the updated range values.
   */
  dispatchRangeChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("rangechange", {
        detail: {
          start: this.start,
          end: this.end,
        },
      }),
    );
  }
}
