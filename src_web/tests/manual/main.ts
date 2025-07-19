/**
 * Simple HTTP server for server connection required JavaScript modules tests
 *
 * Note: About test details, see each testing HTML codes.
 */

import { serveDir } from "jsr:@std/http@1";


Deno.serve(request => {
  const url = new URL(request.url);


  /* Page endpoints */
  if(url.pathname.startsWith("/static")) {
    return serveDir(request, { fsRoot: "../../static", urlRoot: "static"});
  }

  if(url.pathname.startsWith("/test-util")) {
    return serveDir(request, { fsRoot: "./test-util", urlRoot: "test-util"});
  }

  return serveDir(request, { fsRoot: "./", urlRoot: ""});
});
