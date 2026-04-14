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
   * Listener function of WebSocket event 'open'
   *
   * @type {function}
   */
  #on_open_listener;

  /**
   * Listener function of WebSocket event 'message'
   *
   * @type {function}
   */
  #on_message_listener;

  /**
   * Listener function of WebSocket event 'close'
   *
   * @type {function}
   */
  #on_close_listener;

  /**
   * Listener function of WebSocket event 'error'
   *
   * @type {function}
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

    this.#on_open_listener    = () => {};
    this.#on_message_listener = () => {};
    this.#on_close_listener   = () => {};
    this.#on_error_listener   = () => {};

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

  set on_open(listener) {
    this.#ws.removeEventListener("open", this.#on_open_listener);
    this.#on_open_listener = listener;
    this.#ws.addEventListener("open", this.#on_open_listener);
  }
  set on_message(listener) {
    this.#ws.removeEventListener("message", this.#on_message_listener);
    this.#on_message_listener = listener;
    this.#ws.addEventListener("message", this.#on_message_listener);
  }
  set on_close(listener) {
    this.#ws.removeEventListener("close", this.#on_close_listener);
    this.#on_close_listener = listener;
    this.#ws.addEventListener("close", this.#on_close_listener);
  }
  set on_error(listener) {
    this.#ws.removeEventListener("error", this.#on_error_listener);
    this.#on_error_listener = listener;
    this.#ws.addEventListener("error", this.#on_error_listener);
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
    this.#ws = new WebSocket(url);
    this.#ws.binaryType = binaryType;

    this.#ws.addEventListener("open"   , this.#on_open_listener);
    this.#ws.addEventListener("message", this.#on_message_listener);
    this.#ws.addEventListener("close"  , this.#on_close_listener);
    this.#ws.addEventListener("error"  , this.#on_error_listener);

    this.#ws.addEventListener("close", this.#reconnect.bind(this));
    this.#ws.addEventListener("error", this.#reconnect.bind(this));
  }
}
