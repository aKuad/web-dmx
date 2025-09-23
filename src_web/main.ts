/**
 * DMX control on web application
 */

import process from "node:process";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { yellow, green } from "@std/fmt/colors";

import { SerialPort } from "serialport";
import serveStatic from "serve-static";
import finalhandler from "finalhandler";
import { WebSocketServer } from "ws";

import { ws_broadcast } from "./modules/ws_broadcast.ts";
import { DMXDeviceMock } from "./modules/DMXDeviceMock.ts";
import { DMX_CHANNEL_COUNT, encode_lanes_initialize_packet } from "./static/packet/lanes_initialize.js";
import { decode_lane_modify_packet, is_lane_modify_packet } from "./static/packet/lane_modify.js";


const server_static = serveStatic("static");
const server_pages  = serveStatic("pages", { index: ["index.html"] });
const dmx_values_fetch_buf: number[] = [];
const dmx_values_server = new Uint8Array(DMX_CHANNEL_COUNT);
const dmx_values_device = new Uint8Array(DMX_CHANNEL_COUNT);
const ws_clients = new Set<WebSocket>();


/* Device communication process */
// Preparing
const device_path       = process.argv[2];
const is_device_connect = Boolean(device_path);

if(is_device_connect) {
  console.log(green(`Connecting to '${device_path}'`));
} else {
  console.log(yellow("Serial device unspecified, runs without device."));
  console.log(yellow("To run with device:"));
  console.log(yellow("  npm start <device path or COM port name>"));
  console.log(yellow(""));
  console.log(yellow("Detected devices:"));
  const devices     = await SerialPort.list();
  const devices_str = devices.map(e => `${e.path} - ${e.manufacturer || "Unknown manufacturer"}`);
  devices_str.forEach(e => console.log(yellow("  " + e)));
}

// Device connecting
DMXDeviceMock.binding.createPort("/dev/mock");
const device = is_device_connect ? new SerialPort   ({ path: device_path, baudRate: 115200, autoOpen: false })
                                 : new DMXDeviceMock({ path: "/dev/mock", baudRate: 115200, autoOpen: false });

// Current values fetching from device on init
device.open(() => {
  device.write([0xff, 0xff, 0xff]);
});
device.on("data", data => {
  if(dmx_values_fetch_buf.length < DMX_CHANNEL_COUNT)
    dmx_values_fetch_buf.push(...new Uint8Array(data));

  if(dmx_values_fetch_buf.length === DMX_CHANNEL_COUNT) {
    dmx_values_fetch_buf.forEach((value, index) => {
      dmx_values_server[index] = value;
      dmx_values_device[index] = value;
    })
  }
});


/* HTTP server process */
const http_server = createServer((request, response) => {
  const url = { pathname: request.url || "" };
  // const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static")) {
    request.url = url.pathname.replace(/^\/static\//, "/");
    server_static(request, response, finalhandler(request, response));
    return;
  }
  // favicon.ico on URL root
  if(url.pathname === "/favicon.ico") {
    response.writeHead(200, { "content-type": "image/vnd.microsoft.icon" });
    createReadStream("./favicon.ico").pipe(response);
    return;
  }


  /* API endpoints */
  if(url.pathname.startsWith("/api/controller")) {
    response.statusCode = 426;
    response.write("This API is for websocket, protocol upgrade required");
    response.end();
    return;
  }


  /* Pages endpoints */
  server_pages(request, response, finalhandler(request, response));
});


/* WebSocket API endpoints */
const wss = new WebSocketServer({ server: http_server, path: "/api/controller" });
wss.on("connection", (socket: WebSocket) => {
  socket.binaryType = "arraybuffer";

  // On a client connected
  socket.send(encode_lanes_initialize_packet(dmx_values_server));
  ws_clients.add(socket);

  socket.addEventListener("message", e => {
    // On lane controlled by a client
    if(is_lane_modify_packet(e.data)) {
      ws_broadcast(ws_clients, e.data, socket);
      const { channel, value } = decode_lane_modify_packet(e.data);
      dmx_values_server[channel-1] = value;
    }
  });

  // On a client disconnected
  socket.addEventListener("close", () => ws_clients.delete(socket));
  socket.addEventListener("error", () => ws_clients.delete(socket));
});


http_server.listen(8000, "0.0.0.0");
