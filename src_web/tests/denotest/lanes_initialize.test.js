/**
 * Tests for `packet/lanes_initialize.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals, assertThrows } from "jsr:@std/assert@1";

import { encode_lanes_initialize_packet, decode_lanes_initialize_packet, is_lanes_initialize_packet,
         DMX_CHANNEL_COUNT } from "../../static/packet/lanes_initialize.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can encode/decode lanes-initialize packet
   *   - Original data and decoded data must be equal
   * - Can verify the packet is valid lanes-initialize packet
   */
  await t.step(function encode_verify_decode() {
    const values_org = new Uint8Array(DMX_CHANNEL_COUNT);
    values_org[0] = 0;    // Min case
    values_org[1] = 255;  // Max case
    const is_on_org  = new Array(DMX_CHANNEL_COUNT).fill(true);
    is_on_org[0] = false; // For all false byte test
    is_on_org[1] = false; //
    is_on_org[2] = false; //
    is_on_org[3] = false; //
    is_on_org[4] = false; //
    is_on_org[5] = false; //
    is_on_org[6] = false; //
    is_on_org[7] = false; //
    const packet = encode_lanes_initialize_packet(values_org, is_on_org);
    const { values, is_on } = decode_lanes_initialize_packet(packet);

    assertEquals(is_lanes_initialize_packet(packet), true);
    assertEquals(values, values_org);
    assertEquals(is_on, is_on_org);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect values length is not 512
   * - Can detect is_on length is not 512
   */
  await t.step(function encode_invalid_argument() {
    const values_correct   = new Uint8Array(DMX_CHANNEL_COUNT);
    const values_too_short = new Uint8Array(DMX_CHANNEL_COUNT - 1);
    const values_too_long  = new Uint8Array(DMX_CHANNEL_COUNT + 1);
    const is_on_correct    = Array(DMX_CHANNEL_COUNT).fill(true);
    const is_on_too_short  = Array(DMX_CHANNEL_COUNT - 1).fill(true);
    const is_on_too_long   = Array(DMX_CHANNEL_COUNT + 1).fill(true);
    assertThrows(() => encode_lanes_initialize_packet(values_too_short, is_on_correct  ), RangeError, "values length must be 512, but got 511");
    assertThrows(() => encode_lanes_initialize_packet(values_too_long , is_on_correct  ), RangeError, "values length must be 512, but got 513");
    assertThrows(() => encode_lanes_initialize_packet(values_correct  , is_on_too_short), RangeError, "is_on length must be 512, but got 511");
    assertThrows(() => encode_lanes_initialize_packet(values_correct  , is_on_too_long ), RangeError, "is_on length must be 512, but got 513");
  });


  /**
   * - Can detect non lanes-initialize packet
   *   - When length is invalid
   */
  await t.step(function decode_invalid_packet() {
    const packet_correct = new Uint8Array(DMX_CHANNEL_COUNT + DMX_CHANNEL_COUNT / 8);
    packet_correct[0] = 0x00; // Min case
    packet_correct[1] = 0xff; // Max case

    const packet_too_short  = Uint8Array.of(...packet_correct.slice(0, -1)).buffer; // Cut last 1 byte
    const packet_too_long   = Uint8Array.of(...packet_correct, 0x00).buffer;  // 0x00 as extra byte

    assertThrows(() => decode_lanes_initialize_packet(packet_too_short) , Error, "It is not a lanes-initialize packet");
    assertThrows(() => decode_lanes_initialize_packet(packet_too_long)  , Error, "It is not a lanes-initialize packet");
  });


  /*
   * For `is_lanes_initialize_packet` test is done by `decode_invalid_packet`
   */
});
