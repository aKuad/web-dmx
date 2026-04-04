/**
 * Simple HTTP server for server connection required JavaScript modules tests
 *
 * Note: About test details, see each testing HTML codes.
 */

import { serveDir } from "jsr:@std/http@1";


Deno.serve(request => {
  const url = new URL(request.url);


  /* API endpoints */
  if(url.pathname.startsWith("/api/websocket-echo")) {
    if(request.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(request);
      socket.addEventListener("message", e => {
        socket.send(e.data);
      });
      return response;

    } else {
      new Response("This API is for websocket, protocol upgrade required", { status: 426 });
    }
  }


  /* Page endpoints */
  if(url.pathname.startsWith("/static")) {
    return serveDir(request, { fsRoot: "../../static", urlRoot: "static"});
  }

  if(url.pathname.startsWith("/test-util")) {
    return serveDir(request, { fsRoot: "./test-util", urlRoot: "test-util"});
  }

  return serveDir(request, { fsRoot: "./", urlRoot: ""});
});
