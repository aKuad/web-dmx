/**
 * DMX control on web application
 */

import { serveDir, serveFile } from "jsr:@std/http@1";

import { ws_broadcast } from "./modules/ws_broadcast.ts";
import { DMX_CHANNEL_COUNT, encode_lanes_initialize_packet } from "./static/packet/lanes_initialize.js";
import { decode_lane_modify_packet, is_lane_modify_packet } from "./static/packet/lane_modify.js";


const dmx_values = new Uint8Array(DMX_CHANNEL_COUNT);
const ws_clients = new Set<WebSocket>();


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
