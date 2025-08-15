/**
 * Data broadcasting to multiple WebSocket instances
 *
 * @module
 */


/**
 * Data broadcasting to multiple WebSocket instances
 *
 * @param clients WebSocket instances to send
 * @param send_data Data to send
 * @param origin_client Exclude instance from `clients` to send
 */
export function ws_broadcast(clients: Set<WebSocket>, send_data: ArrayBuffer, origin_client: WebSocket) {
  clients.forEach(client => {
    if(client === origin_client)
      return;
    if(client.readyState === client.OPEN)
      client.send(send_data);
  })
}
