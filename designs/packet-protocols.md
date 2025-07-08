# Packet protocols

## Lane modify packet (device)

| Length \[bytes\] | Type        | Description    |
| ---------------: | ----------- | -------------- |
|                2 | uint16 (\*) | Channel number |
|                1 | uint8       |                |

> [!NOTE]
>
> (\*) uint16 value must be little endian.

## Lane modify packet (web)

| Length \[bytes\] | Type        | Description           |
| ---------------: | ----------- | --------------------- |
|                1 | uint8       | Packet type ID (0x10) |
|                2 | uint16 (\*) | Channel number        |
|                1 | uint8       | Channel value         |

## Lanes initialize packet (web)

| Length \[bytes\] | Type  | Description           |
| ---------------: | ----- | --------------------- |
|                1 | uint8 | Packet type ID (0x11) |
|              512 | uint8 | All channel values    |
