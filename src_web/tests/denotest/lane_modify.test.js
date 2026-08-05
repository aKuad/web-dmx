/**
 * Tests for `packet/lane_modify.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals, assertThrows } from "jsr:@std/assert@1";

import { encode_lane_modify_packet, decode_lane_modify_packet, is_lane_modify_packet,
         DMX_CHANNEL_MIN, DMX_CHANNEL_MAX, DMX_VALUE_MIN, DMX_VALUE_MAX } from "../../static/packet/lane_modify.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can encode/decode lane-modify packet
   *   - Original data and decoded data must be equal
   *   - Test on minimum channel and value
   * - Can verify the packet is valid lane-modify packet
   */
  await t.step(function encode_verify_decode_min() {
    const packet                  = encode_lane_modify_packet(DMX_CHANNEL_MIN, DMX_VALUE_MIN, false);
    const {channel, value, is_on} = decode_lane_modify_packet(packet);

    assertEquals(is_lane_modify_packet(packet), true);
    assertEquals(channel, DMX_CHANNEL_MIN);
    assertEquals(value, DMX_VALUE_MIN);
    assertEquals(is_on, false);
  });


  /**
   * - Maximum value case of `encode_verify_decode_min`
   */
  await t.step(function encode_verify_decode_max() {
    const packet                  = encode_lane_modify_packet(DMX_CHANNEL_MAX, DMX_VALUE_MAX, true);
    const {channel, value, is_on} = decode_lane_modify_packet(packet);

    assertEquals(is_lane_modify_packet(packet), true);
    assertEquals(channel, DMX_CHANNEL_MAX);
    assertEquals(value, DMX_VALUE_MAX);
    assertEquals(is_on, true);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect channel is not in 1~512
   * - Can detect value is not in 0~255
   */
  await t.step(function encode_invalid_argument() {
    assertThrows(() => encode_lane_modify_packet(  0,   0, true), RangeError, "channel must be in 1~512, but got 0");
    assertThrows(() => encode_lane_modify_packet(513,   0, true), RangeError, "channel must be in 1~512, but got 513");
    assertThrows(() => encode_lane_modify_packet(  1,  -1, true), RangeError, "value must be in 0~255, but got -1");
    assertThrows(() => encode_lane_modify_packet(  1, 256, true), RangeError, "value must be in 0~255, but got 256");
  });


  /**
   * - Can detect non lane-modify packet
   *   - When length is not 3 bytes
   *   - When packet ID is not match
   */
  await t.step(function decode_invalid_packet() {
    const packet_too_short  = Uint8Array.of(0x01, 0x00).buffer;
    const packet_too_long   = Uint8Array.of(0x01, 0x00, 0x00, 0x10).buffer;  // 0x10 as extra byte

    assertThrows(() => decode_lane_modify_packet(packet_too_short) , Error, "It is not a lane-modify packet - got [1,0]");
    assertThrows(() => decode_lane_modify_packet(packet_too_long ) , Error, "It is not a lane-modify packet - got [1,0,0,16]");
  });


  /*
   * For `is_lane_modify_packet` test is done by `decode_invalid_packet`
   */
});
