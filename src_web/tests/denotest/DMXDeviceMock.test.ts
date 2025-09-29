/**
 * Tests for `packet/lane_modify.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test --allow-env --allow-read --allow-ffi`
 *
 * @author aKuad
 */

import { assertEquals } from "jsr:@std/assert@1/equals";
import { Buffer } from "node:buffer";

import { DMXDeviceMock } from "../../modules/DMXDeviceMock.ts";
import { DMX_CHANNEL_COUNT } from "../../static/packet/lanes_initialize.js";
import { DMX_CHANNEL_MAX, DMX_CHANNEL_MIN } from "../../static/packet/lane_modify.js";


/**
 * Make a short sleep to progress IO process
 *
 * @returns Promise object what resolved on 1ms elapsed
 */
function io_sleep(): Promise<undefined> {
  return new Promise(resolve => setTimeout(() => resolve(undefined), 1));
}


/**
 * Repeat read from device mock until read success
 *
 * @param device Device instance
 * @param size Byte count to read
 * @returns Read bytes
 */
async function read_until_success(device: DMXDeviceMock, size: number): Promise<Buffer> {
  let values_prc = null;
  while(!values_prc) {
    await io_sleep();
    values_prc = device.read(size);
  }
  return values_prc;
}


Deno.test(async function true_cases(t) {
  /**
   * - Can set device internal values memory by lane modify packet
   */
  await t.step(async function lane_modify() {
    DMXDeviceMock.binding.createPort("/dev/mock");
    const device = new DMXDeviceMock({ path: "/dev/mock", baudRate: 115200 });
    await io_sleep();

    const value_at_min_ch = 100;
    device.write([DMX_CHANNEL_MIN & 0xff, (DMX_CHANNEL_MIN >> 8) & 0xff, value_at_min_ch]);

    const value_at_max_ch = 200;
    device.write([DMX_CHANNEL_MAX & 0xff, (DMX_CHANNEL_MAX >> 8) & 0xff, value_at_max_ch]);

    const values_exp = Buffer.alloc(DMX_CHANNEL_COUNT, 0);
    values_exp[DMX_CHANNEL_MIN] = value_at_min_ch;
    values_exp[DMX_CHANNEL_MAX] = value_at_max_ch;

    device.write([0xff, 0xff, 0xff]);
    const values_prc = await read_until_success(device, DMX_CHANNEL_COUNT);
    device.close();

    assertEquals(values_prc, values_exp);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can't modify device internal values memory by lane modify packet
   */
  await t.step(async function channel_out_of_range() {
    DMXDeviceMock.binding.createPort("/dev/mock");
    const device = new DMXDeviceMock({ path: "/dev/mock", baudRate: 115200 });
    await io_sleep();

    device.write([0xff, 0xff, 0xff]);
    const values_org = await read_until_success(device, DMX_CHANNEL_COUNT);

    const value = 100;
    const channel_under_range = 0;
    device.write([channel_under_range & 0xff, (channel_under_range >> 8) & 0xff, value]);
    const channel_over_range = 0;
    device.write([channel_over_range  & 0xff, (channel_over_range  >> 8) & 0xff, value]);

    device.write([0xff, 0xff, 0xff]);
    const values_prc = await read_until_success(device, DMX_CHANNEL_COUNT);
    device.close();

    assertEquals(values_prc, values_org);
  });
});
