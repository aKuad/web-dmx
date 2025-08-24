/**
 * DMX control on web application
 */

import { serveDir, serveFile } from "jsr:@std/http@1";
import { yellow, green } from "jsr:@std/fmt@1/colors";

// import { SerialPort } from "npm:serialport@12";

import { ws_broadcast } from "./modules/ws_broadcast.ts";
import { DMX_CHANNEL_COUNT, encode_lanes_initialize_packet } from "./static/packet/lanes_initialize.js";
import { decode_lane_modify_packet, is_lane_modify_packet } from "./static/packet/lane_modify.js";


const dmx_values = new Uint8Array(DMX_CHANNEL_COUNT);
const ws_clients = new Set<WebSocket>();


/* Device communication process */
if(Deno.args[0]) {
  console.log(green(`Connecting to '${Deno.args[0]}'`));
  console.log(yellow("Now in under construction - device communication is unimplemented"));
  // const device = new SerialPort({ path: Deno.args[0], baudRate: 115200, autoOpen: true });

} else {
  console.log(yellow("Serial device unspecified, runs without device."));
  console.log(yellow("To run with device:"));
  console.log(yellow("  deno run --allow-net --allow-read main.ts <device path or COM port name>"));
}


/* HTTP server process */
Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static"))
    return serveDir(request, { fsRoot: "static", urlRoot: "static" });
  // favicon.ico on URL root
  if(url.pathname === "/favicon.ico")
    return serveFile(request, "./favicon.ico");


  /* API endpoints */
  if(url.pathname.startsWith("/api/controller")) {
    if(request.headers.get("upgrade") !== "websocket")
      return new Response("This API is for websocket, protocol upgrade required", { status: 426 });

    const { response, socket } = Deno.upgradeWebSocket(request);
    socket.binaryType = "arraybuffer";

    // On a client connected
    socket.addEventListener("open", () => {
      socket.send(encode_lanes_initialize_packet(dmx_values));
      ws_clients.add(socket);
    });
    // On lane controlled by a client
    socket.addEventListener("message", e => {
      if(is_lane_modify_packet(e.data)) {
        ws_broadcast(ws_clients, e.data, socket);
        const { channel, value } = decode_lane_modify_packet(e.data);
        dmx_values[channel-1] = value;
      }
    });
    // On a client disconnected
    socket.addEventListener("close", () => ws_clients.delete(socket));
    socket.addEventListener("error", () => ws_clients.delete(socket));

    return response;
  }


  /* Pages endpoints */
  return serveDir(request, { fsRoot: "pages", urlRoot: "" });
});
