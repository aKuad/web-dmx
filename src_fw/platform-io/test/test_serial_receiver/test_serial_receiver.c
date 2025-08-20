/**
 * Test for `serial_receiver.c` module
 */

#include "unity.h"

#include "serial_receiver.h"


void setUp() {
  // Nothing to do
}

void tearDown() {
  // Nothing to do
}


/**
 * Lane modify packet receiving - True case
 */
void true_lane_modify() {
  uint16_t channel;
  uint8_t value;

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value));

  uint8_t test_input_min[3] = { (DMX_CHANNEL_MIN >> 0) & 0xff, (DMX_CHANNEL_MIN >> 8) & 0xff, DMX_VALUE_MIN };
  serial_input(test_input_min);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value));
  TEST_ASSERT_EQUAL(DMX_CHANNEL_MIN, channel);
  TEST_ASSERT_EQUAL(DMX_VALUE_MIN, value);

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value));

  uint8_t test_input_max[3] = { (DMX_CHANNEL_MAX >> 0) & 0xff, (DMX_CHANNEL_MAX >> 8) & 0xff, DMX_VALUE_MAX };
  serial_input(test_input_max);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value));
  TEST_ASSERT_EQUAL(DMX_CHANNEL_MAX, channel);
  TEST_ASSERT_EQUAL(DMX_VALUE_MAX  , value);

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value));
}


/**
 * Lane modify packet receiving - Error case: invalid channel
 */
void err_lane_modify_invalid_channel() {
  uint8_t test_input_ch_zero[3] = { 0x00, 0x00, DMX_VALUE_MIN };
  // Channel 0 as invalid input
  // Value 0x00, but won't be used
  serial_input(test_input_ch_zero);
  TEST_ASSERT_EQUAL(0, is_lane_modify_received());

  uint8_t test_input_ch_over[3] = { (DMX_CHANNEL_MAX + 1 >> 0) & 0xff, (DMX_CHANNEL_MAX + 1 >> 8) & 0xff, DMX_VALUE_MIN };
  // Channel 513 as invalid input
  // Value 0x00, but won't be used
  serial_input(test_input_ch_over);
  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
}


/**
 * Values request packet receiving - True case
 */
void true_values_request() {
  uint8_t test_input_values_request[3] = { 0xff, 0xff, 0xff };
  serial_input(test_input_values_request);
  TEST_ASSERT_EQUAL(1, is_values_request_received());

  reset_values_request_received();
  TEST_ASSERT_EQUAL(0, is_values_request_received());
}


int main() {
  UNITY_BEGIN();

  RUN_TEST(true_lane_modify);
  RUN_TEST(err_lane_modify_invalid_channel);
  RUN_TEST(true_values_request);

  return UNITY_END();
}
