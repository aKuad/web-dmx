/**
 * DMX control on web application
 */

import { serveDir, serveFile } from "jsr:@std/http@1";
import { DMX_CHANNEL_COUNT, encode_lanes_initialize_packet } from "./static/packet/lanes_initialize.js";
import { decode_lane_modify_packet, is_lane_modify_packet } from "./static/packet/lane_modify.js";


const dmx_values = new Uint8Array(DMX_CHANNEL_COUNT);
dmx_values[1] = 255;  // Channel 2 set 255
dmx_values[2] = 100;  // Channel 3 set 100 for lanes-initialize packet test


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
    // Apply current values to client UI
    socket.addEventListener("open", () => {
      socket.send(encode_lanes_initialize_packet(dmx_values));
    });
    // On lane controlled by client
    socket.addEventListener("message", e => {
      if(is_lane_modify_packet(e.data))
        console.log(decode_lane_modify_packet(e.data));
    });
    return response;
  }


  /* Pages endpoints */
  return serveDir(request, { fsRoot: "pages", urlRoot: "" });
});
