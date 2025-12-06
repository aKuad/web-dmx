/**
 * Index (app main) script
 */

import { DMXLanes } from "./DMXLanes/DMXLanes.js";
import { export_as_download } from "./export_as_download.js";
import { decode_lanes_initialize_packet, is_lanes_initialize_packet } from "./packet/lanes_initialize.js";
import { encode_lane_modify_packet, decode_lane_modify_packet, is_lane_modify_packet } from "./packet/lane_modify.js";


globalThis.addEventListener("load", () => {
  // Variables
  const dmx_lanes = new DMXLanes(document.getElementById("dmx-lanes-tabs-container"), document.getElementById("dmx-lanes-lanes-container"));
  const is_demo = location.hostname.endsWith("github.io");
  const ws = is_demo ? new EventTarget() : new WebSocket("/api/controller");  // For demo, instantiate EventTarget alternative of WebSocket
  ws.binaryType = "arraybuffer";
  const STORAGE_KEY_CURRENT_TAB = "current-tab-auto-save";
  const STORAGE_KEY_USER_LABELS = "user-labels-auto-save";


  // Current tab auto restore
  //// Restoring
  if(localStorage.getItem(STORAGE_KEY_CURRENT_TAB))
    dmx_lanes.current_tab = localStorage.getItem(STORAGE_KEY_CURRENT_TAB);
  //// Storing
  globalThis.addEventListener("beforeunload", () => {
    localStorage.setItem(STORAGE_KEY_CURRENT_TAB, dmx_lanes.current_tab);
  });


  // User labels auto restore
  //// Restoring
  if(localStorage.getItem(STORAGE_KEY_USER_LABELS))
    dmx_lanes.user_labels_json = localStorage.getItem(STORAGE_KEY_USER_LABELS);
  //// Storing
  globalThis.addEventListener("beforeunload", () => {
    localStorage.setItem(STORAGE_KEY_USER_LABELS, dmx_lanes.user_labels_json);
  });


  // User labels import/export
  //// Importing
  document.getElementById("button-labels-import-input").addEventListener("input", e => {
    const file = e.target.files[0];
    if(file) {
      file.text()
      .then(text => dmx_lanes.user_labels_json = text)
      .catch(error => alert(`Failed to load the file:\n${error.message}`));
    }

    // For reset file input
    e.target.type = "text";
    e.target.type = "file";
  });
  //// Exporting
  document.getElementById("button-labels-export").addEventListener("click", () => {
    const output_file = new Blob([dmx_lanes.user_labels_json], { type: "application/json" });
    const file_name = `WebDMX-${ new Date().toISOString()}.webdmx.json`;
    export_as_download(output_file, file_name);
  });


  // UI control process
  dmx_lanes.addEventListener("value-changed", e => {
    const channel = Number(e.origin);
    const value = e.data;
    const packet = encode_lane_modify_packet(channel, value);
    if(ws.readyState === WebSocket.OPEN)
      ws.send(packet);
  });


  // Packets from server process
  ws.addEventListener("message", e => {
    if(is_lane_modify_packet(e.data)) {
      const { channel, value } = decode_lane_modify_packet(e.data);
      dmx_lanes.set_value(channel, value);

    } else if(is_lanes_initialize_packet(e.data)) {
      const values = decode_lanes_initialize_packet(e.data);
      values.forEach((value, index) => dmx_lanes.set_value(index + 1, value));
    }
  });


  // Server disconnected view
  ws.addEventListener("close", () => document.getElementById("error-view").innerText = "Connection closed by server");
  ws.addEventListener("error", () => document.getElementById("error-view").innerText = "Connection error occurred");
});
