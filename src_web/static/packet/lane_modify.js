/**
 * Encoding/decoding functions for lane-modify packet
 *
 * More detail of packet protocol, see `designs/packet-protocols.md`
 *
 * @module
 */


/**
 * Minimum number of channel
 */
export const DMX_CHANNEL_MIN = 1;

/**
 * Maximum value of channel
 */
export const DMX_CHANNEL_MAX = 512;

/**
 * Minimum of value
 */
export const DMX_VALUE_MIN = 0;

/**
 * Maximum of value
 */
export const DMX_VALUE_MAX = 255;


/**
 * Create lane-modify packet
 *
 * @param {number} channel Modified channel to contain
 * @param {number} value Value to contain
 * @param {boolean} is_on true: lane un-mute, false: lane mute
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When not in 1~512 channel passed
 * @throws {RangeError} When not in 0~255 value passed
 */
export function encode_lane_modify_packet(channel, value, is_on) {
  if(channel < DMX_CHANNEL_MIN || DMX_CHANNEL_MAX < channel)
    throw new RangeError(`channel must be in 1~512, but got ${channel}`);
  if(value < DMX_VALUE_MIN || DMX_VALUE_MAX < value)
    throw new RangeError(`value must be in 0~255, but got ${value}`);

  return Uint8Array.of(
    (is_on ? 1 << 5 : 0) | (((channel - 1) >> 8) & 0b1),
    (channel - 1) & 0xFF,
    value
  ).buffer;
}


/**
 * Data structure of lane-modify packet data
 *
 * @typedef {Object} LaneModifyPacketData
 * @property {number} channel Modified channel
 * @property {number} value Value
 * @property {boolean} is_on true: lane un-mute, false: lane mute
 */

/**
 * Unpack lane-modify packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {LaneModifyPacketData} Decoded packet data
 *
 * @throws {Error} When non lane-modify packet array passed
 */
export function decode_lane_modify_packet(packet) {
  const packet_uint8 = new Uint8Array(packet);
  if(!is_lane_modify_packet(packet))
    throw new Error(`It is not a lane-modify packet - got [${packet_uint8.toString()}]`);

  return {
    channel: (((packet_uint8[0] & 0b1) << 8) | packet_uint8[1]) + 1,
    value: packet_uint8[2],
    is_on: Boolean(packet_uint8[0] & 0b00100000)
  };
}


/**
 * Verify the packet is lane-modify packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is lane-modify packet: true, otherwise: false
 */
export function is_lane_modify_packet(packet) {
  return packet.byteLength === 3;
}
