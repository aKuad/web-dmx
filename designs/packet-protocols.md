# Packet protocols

## Lane modify packet (device)

Direction: Server -> Device

| Length \[bytes\] | Type        | Description    |
| ---------------: | ----------- | -------------- |
|                2 | uint16 (\*) | Channel number |
|                1 | uint8       |                |

> [!NOTE]
>
> (\*) uint16 value must be little endian.

## Lane modify packet (web)

Direction: Client <-> Server

| Length \[bytes\] | Type        | Description           |
| ---------------: | ----------- | --------------------- |
|                1 | uint8       | Packet type ID (0x10) |
|                2 | uint16 (\*) | Channel number        |
|                1 | uint8       | Channel value         |

## Lanes initialize packet (web)

Direction: Client <- Server

| Length \[bytes\] | Type  | Description                              |
| ---------------: | ----- | ---------------------------------------- |
|                1 | uint8 | Packet type ID (0x11)                    |
|              512 | uint8 | All channel values, start from channel 1 |
