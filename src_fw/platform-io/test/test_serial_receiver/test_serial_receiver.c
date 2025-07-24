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

  serial_input((DMX_CHANNEL_MIN >> 0) & 0xff);
  serial_input((DMX_CHANNEL_MIN >> 8) & 0xff);
  serial_input(DMX_VALUE_MIN);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value));
  TEST_ASSERT_EQUAL(DMX_CHANNEL_MIN, channel);
  TEST_ASSERT_EQUAL(DMX_VALUE_MIN, value);

  serial_input((DMX_CHANNEL_MAX >> 0) & 0xff);
  serial_input((DMX_CHANNEL_MAX >> 8) & 0xff);
  serial_input(DMX_VALUE_MAX);
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
  uint16_t channel;
  uint8_t value;

  serial_input(0x00); // Channel 0 as invalid input
  serial_input(0x00);
  serial_input(DMX_VALUE_MIN);  // Value 0x00, but won't be used
  TEST_ASSERT_EQUAL(0, is_lane_modify_received());

  serial_input(((DMX_CHANNEL_MAX + 1) >> 0) & 0xff); // Channel 513 as invalid input
  serial_input(((DMX_CHANNEL_MAX + 1) >> 8) & 0xff);
  serial_input(DMX_VALUE_MIN);  // Value 0x00, but won't be used
  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
}


/**
 * Values request packet receiving - True case
 */
void true_values_request() {
  serial_input(0xff);
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
