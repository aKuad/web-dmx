/**
 * DMX control on web application
 */

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { yellow, green } from "@std/fmt/colors";

import serveStatic from "serve-static";
import finalhandler from "finalhandler";
import { WebSocketServer } from "ws";

// import { SerialPort } from "npm:serialport@12";

import { ws_broadcast } from "./modules/ws_broadcast.ts";
import { DMX_CHANNEL_COUNT, encode_lanes_initialize_packet } from "./static/packet/lanes_initialize.js";
import { decode_lane_modify_packet, is_lane_modify_packet } from "./static/packet/lane_modify.js";


const server_static = serveStatic("static");
const server_pages  = serveStatic("pages", { index: ["index.html"] });
const dmx_values = new Uint8Array(DMX_CHANNEL_COUNT);
const ws_clients = new Set<WebSocket>();


/* Device communication process */
// deno-lint-ignore no-process-global
if(process.argv[2]) {
  // deno-lint-ignore no-process-global
  console.log(green(`Connecting to '${process.argv[2]}'`));
  console.log(yellow("Now in under construction - device communication is unimplemented"));
  // const device = new SerialPort({ path: process.argv[2], baudRate: 115200, autoOpen: true });

} else {
  console.log(yellow("Serial device unspecified, runs without device."));
  console.log(yellow("To run with device:"));
  console.log(yellow("  npm start <device path or COM port name>"));
}


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
  socket.send(encode_lanes_initialize_packet(dmx_values));
  ws_clients.add(socket);

  socket.addEventListener("message", e => {
    // On lane controlled by a client
    if(is_lane_modify_packet(e.data)) {
      ws_broadcast(ws_clients, e.data, socket);
      const { channel, value } = decode_lane_modify_packet(e.data);
      dmx_values[channel-1] = value;
    }
  });

  // On a client disconnected
  socket.addEventListener("close", () => ws_clients.delete(socket));
  socket.addEventListener("error", () => ws_clients.delete(socket));
});


http_server.listen(8000, "0.0.0.0");
