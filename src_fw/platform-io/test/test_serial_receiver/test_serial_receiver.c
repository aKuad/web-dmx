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
  bool lane_on;

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value, &lane_on));

  uint8_t test_input_min[3] = { 0b00000000, 0b00000000, DMX_VALUE_MIN };
  serial_input(test_input_min);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value, &lane_on));
  TEST_ASSERT_EQUAL(DMX_CHANNEL_MIN, channel);
  TEST_ASSERT_EQUAL(DMX_VALUE_MIN  , value);
  TEST_ASSERT_EQUAL(false          , lane_on);

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value, &lane_on));

  uint8_t test_input_max[3] = { 0b00100001, 0b11111111, DMX_VALUE_MAX };
  serial_input(test_input_max);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value, &lane_on));
  TEST_ASSERT_EQUAL(DMX_CHANNEL_MAX, channel);
  TEST_ASSERT_EQUAL(DMX_VALUE_MAX  , value);
  TEST_ASSERT_EQUAL(true           , lane_on);

  TEST_ASSERT_EQUAL(0, is_lane_modify_received());
  TEST_ASSERT_EQUAL(1, get_lane_modify_data(&channel, &value, &lane_on));
}


/**
 * Values request packet receiving - True case
 */
void true_values_request() {
  TEST_ASSERT_EQUAL(0, is_values_request_received());

  uint8_t test_input_values_request[3] = { 0xff, 0xff, 0xff };
  serial_input(test_input_values_request);
  TEST_ASSERT_EQUAL(1, is_values_request_received());

  reset_values_request_received();
  TEST_ASSERT_EQUAL(0, is_values_request_received());
}


int main() {
  UNITY_BEGIN();

  RUN_TEST(true_lane_modify);
  RUN_TEST(true_values_request);

  return UNITY_END();
}
