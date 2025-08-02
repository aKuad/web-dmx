/**
 * @file serial_receiver.c
 *
 * Bytes processing module for 'Lane modify packet' and 'Value request packet' receiving
 */

#include "serial_receiver.h"


static uint8_t bytes_buffer[3];
static uint8_t bytes_buffer_remain = 0;

static uint16_t channel_next = 0;
static uint8_t value_next = 0;

static uint8_t is_lane_modify_received_flag = 0;
static uint8_t is_values_request_received_flag = 0;


/**
 * Input a byte
 *
 * @param[in] byte Data input from serial
 */
void serial_input(uint8_t byte) {
  // Values request packet processing
  if(bytes_buffer_remain == 0 && byte == 0xff) {
    is_values_request_received_flag = 1;
    return;
  }

  // Lane modify packet processing
  if(bytes_buffer_remain < 3) { // Safety of segmentation fault (out of array range access)
    bytes_buffer[bytes_buffer_remain] = byte;
    bytes_buffer_remain++;
  }

  if(bytes_buffer_remain == 3) {
    uint16_t channel = (bytes_buffer[1] << 8) | bytes_buffer[0];  // Read 2bytes as little endian
    if(1 <= channel && channel <= DMX_CHANNEL_MAX) {
      channel_next = channel;
      value_next = bytes_buffer[2];
      is_lane_modify_received_flag = 1;
    }
    bytes_buffer_remain = 0;
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
