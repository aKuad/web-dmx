/**
 * DMX control lanes UI
 */


/**
 * DMX control lanes UI
 */
export class DMXLanes extends EventTarget {
  /**
   * Tab select control radio button elements array
   *
   * @type {HTMLInputElement[]}
   */
  #tab_radio_elements = [];

  /**
   * Lane elements array
   *
   * Equals of `container_element.getElementsByClassName("DMXLanes-lane")`
   *
   * @type {HTMLLabelElement[]}
   */
  #lane_elements = [];

  /**
   * Slider elements in each lanes
   *
   * Equals of `container_element.getElementsByClassName("DMXLanes-slider")`
   *
   * @type {HTMLInputElement[]}
   */
  #slider_elements = [];


  /**
   * Dispatch when a channel value changed (Not dispatch on changed by `set_value()`)
   *
   * @event MessageEvent#value-changed
   * @type {Object}
   * @property {number} data Moved value (0~255)
   * @property {string} origin Controlled channel
   */

  /**
   * DMX control lanes UI
   *
   * @param {HTMLElement} tabs_container HTML element to view tab UI
   * @param {HTMLElement} lanes_container HTML element to view lane UI
   */
  constructor(tabs_container, lanes_container) {
    super();

    // Field separator create
    lanes_container.classList.add("DMXLanes-lanes-field");
    lanes_container.setAttribute("view-group", 0);  // As default, 'All' tab selected


    // Tabs create
    const tab_texts = ["All", "1-", "65-", "129-", "193-", "257-", "321-", "385-", "449-"];
    for(let i = 0; i < 9; i++) {
      const label = document.createElement("label");
      label.classList.add("DMXLanes-tab");
      label.htmlFor = `DMXLanes-tab-id-${i}`;
      label.innerText = tab_texts[i];
      tabs_container.appendChild(label);

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.style.display = "none";
      radio.name = "DMXLanes-tabs";
      radio.id = `DMXLanes-tab-id-${i}`;
      if(i === 0) radio.checked = true; // As default, 'All' tab selected

      radio.addEventListener("input", () => {
        lanes_container.setAttribute("view-group", i);
      });
      label.appendChild(radio);
      this.#tab_radio_elements.push(radio);
    }


    // Lanes create
    for(let i = 0; i < 512; i++) {
      // Elements creating
      const current_channel = (i + 1).toString();
      const lane = document.createElement("div");
      lane.classList.add("DMXLanes-lane");
      const tab_group = Math.floor(i / 64) + 1;
      lane.classList.add(`DMXLanes-lanes-group-${tab_group}`);

      const ch = document.createElement("div");
      ch.classList.add("DMXLanes-ch");
      ch.innerText = current_channel;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.classList.add("DMXLanes-slider");
      slider.max = 255;
      slider.min = 0;
      slider.step = 1;
      slider.value = 0;
      this.#slider_elements.push(slider);

      const value_box = document.createElement("input");
      value_box.type = "number";
      value_box.classList.add("DMXLanes-value-box");
      value_box.max = 255;
      value_box.min = 0;
      value_box.step = 1;
      value_box.value = 0;

      const user_label = document.createElement("p");
      user_label.classList.add("DMXLanes-user-label");
      user_label.contentEditable = true;

      slider.addEventListener("input", (e => {
        value_box.value = e.target.value;
        this.dispatchEvent(new MessageEvent("value-changed", { data: e.target.value, origin: current_channel }));
      }).bind(this));

      value_box.addEventListener("input", (e => {
        if(e.target.value < 0)
          e.target.value = 0;
        if(e.target.value > 255)
          e.target.value = 255;
        if(e.target.value === "")
          e.target.value = 0;

        slider.value = e.target.value;
        this.dispatchEvent(new MessageEvent("value-changed", { data: e.target.value, origin: current_channel }));
      }).bind(this));

      // Elements applying
      lane.append(ch, slider, value_box, user_label);
      lanes_container.appendChild(lane);
      this.#lane_elements.push(lane);
    }


    // Key control behavior
    globalThis.addEventListener("keydown", e => {
      // Current tab switching
      if(/Digit[1-9]/.test(e.code) && e.ctrlKey) {
        e.preventDefault();
        const select_tab_index = Number(e.code.slice(-1)) - 1;
        this.#tab_radio_elements[select_tab_index].click();
      }

      // Current lane switching
      if(["ArrowRight", "ArrowLeft"].includes(e.code)) {
        const active_slider_index = this.#slider_elements.indexOf(document.activeElement);
        if(active_slider_index === -1) return;  // When no sliders are active, do nothing

        let new_index = active_slider_index;
        if     (e.code == "ArrowRight" && e.altKey)
          new_index += 50;
        else if(e.code == "ArrowLeft"  && e.altKey)
          new_index -= 50;
        else if(e.code == "ArrowRight" && e.ctrlKey)
          new_index += 20;
        else if(e.code == "ArrowLeft"  && e.ctrlKey)
          new_index -= 20;
        else if(e.code == "ArrowRight" && e.shiftKey)
          new_index += 5;
        else if(e.code == "ArrowLeft"  && e.shiftKey)
          new_index -= 5;
        else if(e.code == "ArrowRight")
          new_index += 1;
        else if(e.code == "ArrowLeft")
          new_index -= 1;

        if(new_index < 0)
          new_index = 0;
        else if(new_index > 511)
          new_index = 511;

        e.preventDefault();
        this.#slider_elements[new_index].focus();

        return;
      }

      // Lane value control (with Shift/Ctrl/Alt key)
      if(["ArrowUp", "ArrowDown"].includes(e.code)) {
        const active_slider_index = this.#slider_elements.indexOf(document.activeElement);
        if(active_slider_index === -1) return;  // When no sliders are active, do nothing

        if(!e.altKey && !e.ctrlKey && !e.shiftKey) return;  // When no special control, do nothing
        e.preventDefault();

        const current_value = Number(this.#slider_elements[active_slider_index].value);
        let new_value = current_value;
        if     (e.code == "ArrowUp"   && e.altKey)
          new_value = 255;
        else if(e.code == "ArrowDown" && e.altKey)
          new_value = 0;
        else if(e.code == "ArrowUp"   && e.ctrlKey)
          new_value += 50;
        else if(e.code == "ArrowDown" && e.ctrlKey)
          new_value -= 50;
        else if(e.code == "ArrowUp"   && e.shiftKey)
          new_value += 10;
        else if(e.code == "ArrowDown" && e.shiftKey)
          new_value -= 10;

        if(new_value < 0)
          new_value = 0;
        else if(new_value > 255)
          new_value = 255;

        if(current_value != new_value) {
          this.set_value(active_slider_index + 1, new_value, true);
          this.dispatchEvent(new MessageEvent("value-changed", { data: new_value, origin: active_slider_index + 1 }));
        }
        return;
      }
    });
  }


  /**
   * Set value to a lane
   *
   * MessageEvent("value-changed") won't be dispatched from this method
   *
   * @param {number} channel Channel to set value
   * @param {number} value Modified value
   */
  set_value(channel, value) {
    // Arguments check
    if(channel < 1 || 512 < channel)
      throw new RangeError(`channel must be in 1~512, but got ${channel}`);

    if(value < 0 || 255 < value)
      throw new RangeError(`value must be in 0~255, but got ${value}`);

    const lane      = this.#lane_elements[channel - 1];
    const slider    = lane.getElementsByClassName("DMXLanes-slider")[0];
    const value_box = lane.getElementsByClassName("DMXLanes-value-box")[0];

    slider.value    = value;
    value_box.value = value;
  }


  /**
   * Set user labels
   *
   * @param {string[]} labels Labels to set
   *
   * @throws {SyntaxError} When `labels` is invalid format for JSON
   * @throws {Error} When `labels` is invalid format for user labels
   */
  set user_labels_json(labels_json) {
    const labels = JSON.parse(labels_json); // When non JSON passed, it throws
    if(labels.length !== 512)
      throw new Error("Invalid format as user labels data");

    const label_elements = this.#lane_elements.map(e => e.getElementsByClassName("DMXLanes-user-label")[0]);
    label_elements.forEach((e, i) => {
      e.innerText = labels[i];
    });
  }


  /**
   * Get user labels
   *
   * @returns {string[]} Current labels on the lanes
   */
  get user_labels_json() {
    const label_elements = this.#lane_elements.map(e => e.getElementsByClassName("DMXLanes-user-label")[0]);
    const labels = label_elements.map(e => e.innerText);
    const labels_json = JSON.stringify(labels);
    return labels_json;
  }
}
