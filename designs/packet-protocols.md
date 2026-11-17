# Packet protocols

## System overview

```mermaid
flowchart LR
  A(Web Client) <-->|LAN| B(Web Server)
  B <-->|USB Serial| C(DIY Device)
  C -->|DMX signal| D(DMX Device)
```

## Lane modify packet

Direction:

- Web Server -> DIY Device
- Web Client -> Web Server
  - for own control send
- Web Client <- Web Server
  - for other client control sync

| Byte index | Bits | Description        |
| ---------: | ---: | ------------------ |
|          0 |  7:6 | Reserved (0b00)    |
|          0 |    5 | Lane ON: 1, OFF: 0 |
|          0 |  4:1 | Reserved (0b0000)  |
|          0 |    0 | Channel MSB 8      |
|          1 |  7:0 | Channel LSB 7:0    |
|          2 |  7:0 | Channel value      |

## Values request packet

Direction:

- Web Server -> Device

| Byte index | Bits | Description         |
| ---------: | ---: | ------------------- |
|        0:2 |  7:0 | Magic signal (0xFF) |

## Lanes initialize packet

Direction:

- Web Server <- Device
  - As response of 'Values request packet'
- Client <- Web Server

| Byte index | Bits | Description               |
| ---------: | ---: | ------------------------- |
|          0 |    0 | Channel 1 ON: 1, OFF: 0   |
|          0 |    1 | Channel 2 ON: 1, OFF: 0   |
|          - |    - | ...                       |
|         63 |    6 | Channel 511 ON: 1, OFF: 0 |
|         63 |    7 | Channel 512 ON: 1, OFF: 0 |
|         64 |  7:0 | Channel 1 value           |
|         65 |  7:0 | Channel 2 value           |
|          - |    - | ...                       |
|        574 |  7:0 | Channel 511 value         |
|        575 |  7:0 | Channel 512 value         |
