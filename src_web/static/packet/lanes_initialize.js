/**
 * Encoding/decoding functions for lanes-initialize packet
 *
 * More detail of packet protocol, see `designs/packet-protocols.md`
 */


/**
 * Packet ID of lanes-initialize
 */
const PACKET_ID_LANES_INITIALIZE = 0x11;

/**
 * DMX channels count
 */
export const DMX_CHANNEL_COUNT = 512;


/**
 * Create lanes-initialize packet
 *
 * @param {Uint8Array} values Values array to contain
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When `values` length is not 512
 */
export function encode_lanes_initialize_packet(values) {
  if(values.length !== DMX_CHANNEL_COUNT)
    throw new RangeError(`values length must be 512, but got ${values.length}`);

  const packet = Uint8Array.of(PACKET_ID_LANES_INITIALIZE, ...values).buffer;
  return packet;
}


/**
 * Unpack lanes-initialize packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {Uint8Array} Decoded packet data - is values array
 *
 * @throws {Error} When non lanes-initialize packet array passed
 */
export function decode_lanes_initialize_packet(packet) {
  if(!is_lanes_initialize_packet(packet))
    throw new Error(`It is not a lanes-initialize packet`);

  return new Uint8Array(packet.slice(1));
}


/**
 * Verify the packet is lanes-initialize packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is lanes-initialize packet: true, otherwise: false
 */
export function is_lanes_initialize_packet(packet) {
  if(packet.byteLength !== DMX_CHANNEL_COUNT + 1) return false;

  const packet_id = new DataView(packet).getUint8(0);
  return packet_id === PACKET_ID_LANES_INITIALIZE;
}
