#ifndef __SERIAL_RECEIVER__
#define __SERIAL_RECEIVER__
/**
 * @file serial_receiver.h
 *
 * Bytes processing module for 'Lane modify packet' and 'Value request packet' receiving
 */

#include <stdint.h>


#define DMX_CHANNEL_MAX 512
#define DMX_CHANNEL_MIN 1
#define DMX_VALUE_MAX 255
#define DMX_VALUE_MIN 0


void serial_input(uint8_t byte);
uint8_t is_lane_modify_received();
uint8_t get_lane_modify_data(uint16_t *channel, uint8_t *value);
uint8_t is_values_request_received();
void reset_values_request_received();


#endif /* __SERIAL_RECEIVER__ */
