/**
 * @file serial_receiver.c
 *
 * Bytes processing module for 'Lane modify packet' and 'Value request packet' receiving
 */

#include "serial_receiver.h"


static uint16_t channel_next = 0;
static uint8_t value_next = 0;

static uint8_t is_lane_modify_received_flag = 0;
static uint8_t is_values_request_received_flag = 0;


/**
 * Input bytes
 *
 * @param[in] byte Data input from serial (length must be 3bytes)
 */
void serial_input(uint8_t *bytes) {
  // Check values request packet
  if((bytes[0] & bytes[1] & bytes[2]) == 0xff) {
    is_values_request_received_flag = 1;
    return;
  }

  // Lane modify packet processing
  uint16_t channel = (bytes[1] << 8) | bytes[0];  // Read 2bytes as little endian
  //// Check is channel in correct range, if not, do nothing
  if(DMX_CHANNEL_MIN <= channel && channel <= DMX_CHANNEL_MAX) {
    channel_next = channel;
    value_next = bytes[2];
    is_lane_modify_received_flag = 1;
  }
}


/**
 * Check a lane modify packet is received
 *
 * @return 0: not received, 1: received
 */
uint8_t is_lane_modify_received() {
  return is_lane_modify_received_flag;
}


/**
 * Get lane modify packet data and reset the flag of lane modify packet received
 *
 * @param[out] channel Received data body - channel
 * @param[out] value Received data body - value
 * @return 0: received and wrote value, 1: not received
 */
uint8_t get_lane_modify_data(uint16_t *channel, uint8_t *value) {
  if(is_lane_modify_received_flag == 0) return 1; // When not received, return error

  *channel = channel_next;
  *value = value_next;
  is_lane_modify_received_flag = 0;
  return 0;
}


/**
 * Check a values request packet is received
 *
 * @return 0: not received, 1: received
 */
uint8_t is_values_request_received() {
  return is_values_request_received_flag;
}


/**
 * Reset the flag of values request packet received
 */
void reset_values_request_received() {
  is_values_request_received_flag = 0;
}
