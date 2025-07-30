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
    const packet = encode_lanes_initialize_packet(values_org);
    const values = decode_lanes_initialize_packet(packet);

    assertEquals(is_lanes_initialize_packet(packet), true);
    assertEquals(values, values_org);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect values length is not 512
   */
  await t.step(function encode_invalid_argument() {
    const values_too_short = new Uint8Array(DMX_CHANNEL_COUNT - 1);
    const values_too_long  = new Uint8Array(DMX_CHANNEL_COUNT + 1);
    assertThrows(() => encode_lanes_initialize_packet(values_too_short), RangeError, "values length must be 512, but got 511");
    assertThrows(() => encode_lanes_initialize_packet(values_too_long) , RangeError, "values length must be 512, but got 513");
  });


  /**
   * - Can detect non lanes-initialize packet
   *   - When length is not 513 bytes
   *   - When packet ID is not match
   */
  await t.step(function decode_invalid_packet() {
    const packet_correct = new Uint8Array(DMX_CHANNEL_COUNT + 1);
    packet_correct[0] = 0x11; // Packet ID set
    packet_correct[1] = 0x00; // Min value as test data
    packet_correct[2] = 0xff; // Max value as test data

    const packet_too_short  = Uint8Array.of(...packet_correct.slice(0, -1)).buffer; // Cut last 1 byte
    const packet_too_long   = Uint8Array.of(...packet_correct, 0x00).buffer;  // 0x00 as extra byte
    const packet_invalid_id = Uint8Array.of(...packet_correct).buffer;
    new DataView(packet_invalid_id).setUint8(0, 0x12);  // 0x12 as non 0x11 value

    assertThrows(() => decode_lanes_initialize_packet(packet_too_short) , Error, "It is not a lanes-initialize packet");
    assertThrows(() => decode_lanes_initialize_packet(packet_too_long)  , Error, "It is not a lanes-initialize packet");
    assertThrows(() => decode_lanes_initialize_packet(packet_invalid_id), Error, "It is not a lanes-initialize packet");
  });


  /*
   * For `is_lanes_initialize_packet` test is done by `decode_invalid_packet`
   */
});
