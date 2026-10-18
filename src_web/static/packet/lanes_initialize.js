/**
 * Encoding/decoding functions for lanes-initialize packet
 *
 * More detail of packet protocol, see `designs/packet-protocols.md`
 *
 * @module
 */


/**
 * DMX channels count
 */
export const DMX_CHANNEL_COUNT = 512;


/**
 * Create lanes-initialize packet
 *
 * @param {Uint8Array} values Values array to contain
 * @param {boolean[]} is_on Is lane unmute or mute flag array to contain
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When `values` length is not 512
 * @throws {RangeError} When `is_on` length is not 512
 */
export function encode_lanes_initialize_packet(values, is_on) {
  if(values.length !== DMX_CHANNEL_COUNT)
    throw new RangeError(`values length must be 512, but got ${values.length}`);

  if(is_on.length !== DMX_CHANNEL_COUNT)
    throw new RangeError(`is_on length must be 512, but got ${is_on.length}`);

  const is_on_bytes = new Uint8Array(DMX_CHANNEL_COUNT / 8);
  is_on.forEach((is_on_current, i) => {
    const byte_index = i >> 3;
    const bit_index  = i & 0b0111;
    is_on_bytes[byte_index] |= is_on_current << bit_index;
  });

  return Uint8Array.of(...values, ...is_on_bytes).buffer;
}


/**
 * Data structure of lane-modify packet data
 *
 * @typedef {Object} LanesInitializePacketData
 * @property {Uint8Array} values Value - 'DMX channel' - 1 = 'Array index'
 * @property {boolean[]} is_on true: lane un-mute, false: lane mute - 'DMX channel' - 1 = 'Array index'
 */

/**
 * Unpack lanes-initialize packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {LanesInitializePacketData} Decoded packet data
 *
 * @throws {Error} When non lanes-initialize packet array passed
 */
export function decode_lanes_initialize_packet(packet) {
  if(!is_lanes_initialize_packet(packet))
    throw new Error(`It is not a lanes-initialize packet`);

  const values = new Uint8Array(packet.slice(0, DMX_CHANNEL_COUNT));

  const is_on = [];
  new Uint8Array(packet.slice(DMX_CHANNEL_COUNT)).forEach(is_on_byte => {
    (is_on_byte >> 0) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 1) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 2) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 3) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 4) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 5) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 6) & 0b1 ? is_on.push(true) : is_on.push(false);
    (is_on_byte >> 7) & 0b1 ? is_on.push(true) : is_on.push(false);
  });

  return { values, is_on};
}


/**
 * Verify the packet is lanes-initialize packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is lanes-initialize packet: true, otherwise: false
 */
export function is_lanes_initialize_packet(packet) {
  return packet.byteLength === (DMX_CHANNEL_COUNT + DMX_CHANNEL_COUNT / 8);
}
