/**
 * DMX Device serial device mock
 *
 * @module
 */

import { Buffer } from "node:buffer";
import process from "node:process";
import { SerialPortMock, SerialPortMockOpenOptions } from "serialport";
import { DMX_CHANNEL_COUNT } from "../static/packet/lanes_initialize.js";
import { DMX_CHANNEL_MIN, DMX_CHANNEL_MAX } from "../static/packet/lane_modify.js";


/**
 * DMX Device serial device mock
 */
export class DMXDeviceMock extends SerialPortMock {
  /** As device internal memory of dmx values */
  #dmx_values: Uint8Array;

  /**
   * Initialize mock and internal memory
   *
   * @param options Options of serialport initialization
   */
  constructor(options: SerialPortMockOpenOptions) {
    super(options);
    this.#dmx_values = new Uint8Array(DMX_CHANNEL_COUNT);
  }

  /**
   * Emulate data sending
   *
   * SerialPort.write(chunk) actual declaration of `chunk` is `any` but it violates deno lint.
   * On this mock, consider only for using `Array` as data input.
   *
   * @param chunk Data to emulate sending
   * @returns `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.
   */
  override write(chunk: Array<number>): boolean {
    // Values request packet processing
    if((chunk[0] & chunk[1] & chunk[2]) === 0xff) {
      process.stdout.write(`DMXDeviceMock - Values request \r`);
      this.port?.emitData(Buffer.from(this.#dmx_values));
      return super.write(chunk);
    }

    // Lane modify packet processing
    const channel = (chunk[1] << 8) | chunk[0];  // Read 2bytes as little endian
    const value = chunk[2];
    const channel_str = channel.toString().padStart(3, " ");
    const value_str = value.toString().padStart(3, " ");

    if(DMX_CHANNEL_MIN <= channel && channel <= DMX_CHANNEL_MAX)
      process.stdout.write(`DMXDeviceMock - ch:${channel_str} val:${value_str} \r`);
    else
      process.stdout.write(`DMXDeviceMock - Invalid channel\r`);

    return super.write(chunk);
  }
}
