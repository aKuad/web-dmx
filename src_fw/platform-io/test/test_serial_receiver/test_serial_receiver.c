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

  serial_input(0x01);
  serial_input(0x00);
  serial_input(0x00);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value));
  TEST_ASSERT_EQUAL(1, channel);
  TEST_ASSERT_EQUAL(0, value);

  serial_input(0x00);
  serial_input(0x02);
  serial_input(0xff);
  TEST_ASSERT_EQUAL(1, is_lane_modify_received());
  TEST_ASSERT_EQUAL(0, get_lane_modify_data(&channel, &value));
  TEST_ASSERT_EQUAL(512, channel);
  TEST_ASSERT_EQUAL(255, value);

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
  serial_input(0x00); // Value 0x00, but won't be used
  TEST_ASSERT_EQUAL(0, is_lane_modify_received());

  serial_input(0x01); // Channel 513 as invalid input
  serial_input(0x02);
  serial_input(0x00); // Value 0x00, but won't be used
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
