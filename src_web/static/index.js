/**
 * Index (app main) script
 */

import { DMXLanes } from "/static/DMXLanes/DMXLanes.js";
import { export_as_download } from "/static/export_as_download.js";
import { decode_lanes_initialize_packet, is_lanes_initialize_packet } from "/static/packet/lanes_initialize.js";
import { encode_lane_modify_packet, decode_lane_modify_packet, is_lane_modify_packet } from "/static/packet/lane_modify.js";


globalThis.addEventListener("load", () => {
  // Variables
  const dmx_lanes = new DMXLanes(document.getElementById("dmx-lanes-container"));
  const ws = new WebSocket("/api/controller");
  ws.binaryType = "arraybuffer";
  const USER_LABELS_STORAGE_KEY = "user-labels-auto-save";


  // User labels auto restore
  //// Restoring
  if(localStorage.getItem(USER_LABELS_STORAGE_KEY))
    dmx_lanes.user_labels_json = localStorage.getItem(USER_LABELS_STORAGE_KEY);
  //// Storing
  globalThis.addEventListener("beforeunload", () => {
    localStorage.setItem(USER_LABELS_STORAGE_KEY, dmx_lanes.user_labels_json);
  });


  // User labels import/export
  //// Exporting
  document.getElementById("button-labels-export").addEventListener("click", () => {
    const output_file = new Blob([dmx_lanes.user_labels_json], { type: "application/json" });
    const file_name = `WebDMX-${ new Date().toISOString()}.json`;
    export_as_download(output_file, file_name);
  });


  // UI control process
  dmx_lanes.addEventListener("value-changed", e => {
    const channel = Number(e.origin);
    const value = e.data;
    const packet = encode_lane_modify_packet(channel, value);
    if(ws.readyState === ws.OPEN)
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
