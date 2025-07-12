# Packet protocols

## Lane modify packet (device)

Direction: Server -> Device

| Length \[bytes\] | Type        | Description    |
| ---------------: | ----------- | -------------- |
|                2 | uint16 (\*) | Channel number |
|                1 | uint8       | Channel value  |

> [!NOTE]
>
> (\*) uint16 value must be little endian.

## Lanes value request packet (device)

Direction: Server -> Device

| Length \[bytes\] | Type       | Description   |
| ---------------: | ---------- | ------------- |
|                1 | uint8 (\*) | Signal (0xFF) |

## Lanes value response packet (device)

Direction: Server <- Device

| Length \[bytes\] | Type  | Description                              |
| ---------------: | ----- | ---------------------------------------- |
|              512 | uint8 | All channel values, start from channel 1 |

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
