/**
 * DMX control on web application
 */

import { serveDir, serveFile } from "jsr:@std/http@1";


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

    const { response } = Deno.upgradeWebSocket(request);
    // Just only upgrade, do nothing for now
    return response;
  }


  /* Pages endpoints */
  return serveDir(request, { fsRoot: "pages", urlRoot: "" });
});
