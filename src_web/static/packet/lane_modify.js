/**
 * Encoding/decoding functions for lane-modify packet
 *
 * More detail of packet protocol, see `designs/packet-protocols.md`
 */


/**
 * Packet ID of lane-modify
 */
const PACKET_ID_LANE_MODIFY = 0x10;

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
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When not in 1~512 channel passed
 * @throws {RangeError} When not in 0~255 value passed
 */
export function encode_lane_modify_packet(channel, value) {
  if(channel < DMX_CHANNEL_MIN || DMX_CHANNEL_MAX < channel)
    throw new RangeError(`channel must be in 1~512, but got ${channel}`);
  if(value < DMX_VALUE_MIN || DMX_VALUE_MAX < value)
    throw new RangeError(`value must be in 0~255, but got ${value}`);

  const packet = Uint8Array.of(PACKET_ID_LANE_MODIFY, 0, 0, value).buffer;
  new DataView(packet).setUint16(1, channel, true); // Write channel as little endian
  return packet;
}


/**
 * Data structure of lane-modify packet data
 *
 * @typedef {Object} LaneModifyPacketData
 * @property {number} channel Modified channel
 * @property {boolean} value Value
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

  const channel = new DataView(packet).getUint16(1, true);
  return {channel: channel, value: packet_uint8[3]};
}


/**
 * Verify the packet is lane-modify packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is lane-modify packet: true, otherwise: false
 */
export function is_lane_modify_packet(packet) {
  if(packet.byteLength != 4) return false;

  const packet_id = new DataView(packet).getUint8(0);
  return packet_id === PACKET_ID_LANE_MODIFY;
}
