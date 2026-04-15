/**
 * WebSocket feature extended for auto reconnecting
 */


/**
 * WebSocket feature extended for auto reconnecting
 */
export class WebSocketAutoRecon {
  /**
   * Current communicating websocket object
   *
   * @type {WebSocket}
   */
  #ws;

  /**
   * Duration of start reconnect from disconnected in milliseconds
   *
   * @type {number}
   */
  #reconnect_ms;

  /**
   * Listener functions of WebSocket event 'open'
   *
   * @type {function[]}
   */
  #on_open_listener;

  /**
   * Listener functions of WebSocket event 'message'
   *
   * @type {function[]}
   */
  #on_message_listener;

  /**
   * Listener functions of WebSocket event 'close'
   *
   * @type {function[]}
   */
  #on_close_listener;

  /**
   * Listener functions of WebSocket event 'error'
   *
   * @type {function[]}
   */
  #on_error_listener;


  /**
   * WebSocket feature extended for auto reconnecting
   *
   * @param {string} url Websocket URL to connect
   * @param {number} reconnect_ms Duration of start reconnect from disconnected in milliseconds
   */
  constructor(url, reconnect_ms) {
    this.#ws = new WebSocket(url);
    this.#reconnect_ms = reconnect_ms;

    this.#on_open_listener    = [];
    this.#on_message_listener = [];
    this.#on_close_listener   = [];
    this.#on_error_listener   = [];

    this.#ws.addEventListener("close", this.#reconnect.bind(this));
    this.#ws.addEventListener("error", this.#reconnect.bind(this));
  }

  /**
   * Compatible property of `WebSocket.binaryType`
   *
   * @param {BinaryType} binaryType Data type at message event ArrayBuffer or Blob
   */
  set binaryType(binaryType) {
    this.#ws.binaryType = binaryType;
  }


  /**
   * Compatible method of `WebSocket.send()`
   *
   * @param {string | ArrayBufferLike | Blob | ArrayBufferView} data Data content to send
   */
  send(data) {
    this.#ws.send(data);
  }


  /**
   * Compatible method of `WebSocket.addEventListener()`
   *
   * @param {"open" | "message" | "close" | "error"} type Type of event
   * @param {function} listener Function to call on event dispatch
   */
  addEventListener(type, listener) {
    switch(type) {
      case "open":
        this.#ws.addEventListener("open", listener);
        this.#on_open_listener.push(listener);
        break;

      case "message":
        this.#ws.addEventListener("message", listener);
        this.#on_message_listener.push(listener);
        break;

      case "close":
        this.#ws.addEventListener("close", listener);
        this.#on_close_listener.push(listener);
        break;

      case "error":
        this.#ws.addEventListener("error", listener);
        this.#on_error_listener.push(listener);
        break;

      default:
        // Undefined even, do nothing
        break;
    }
  }


  /**
   * Reconnect with same URL and listener after specified duration waited
   */
  async #reconnect() {
    const reconnect_ms = this.#reconnect_ms;
    await new Promise(resolve => setTimeout(resolve, reconnect_ms));

    // WebSocket re-instantiate with same URL
    const url = this.#ws.url;
    const binaryType = this.#ws.binaryType;
    const ws = new WebSocket(url);
    this.#ws = ws;
    this.#ws.binaryType = binaryType;

    this.#on_open_listener   .forEach(f => ws.addEventListener("open"   , f));
    this.#on_message_listener.forEach(f => ws.addEventListener("message", f));
    this.#on_close_listener  .forEach(f => ws.addEventListener("close"  , f));
    this.#on_error_listener  .forEach(f => ws.addEventListener("error"  , f));

    this.#ws.addEventListener("close", this.#reconnect.bind(this));
    this.#ws.addEventListener("error", this.#reconnect.bind(this));
  }
}
