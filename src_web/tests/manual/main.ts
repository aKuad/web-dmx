/**
 * Simple HTTP server for server connection required JavaScript modules tests
 *
 * Note: About test details, see each testing HTML codes.
 */

import { serveDir } from "jsr:@std/http@1";


Deno.serve(request => {
  const url = new URL(request.url);


  /* API endpoints */
  // WebSocket API what automatically disconnect in 2 seconds
  if(url.pathname.startsWith("/api/websocket-auto-disconnect")) {
    if(request.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(request);
      setInterval(() => socket.close(), 2000);
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
