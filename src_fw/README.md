# Device source

This device firmware development using [Cube MX](https://www.st.com/en/development-tools/stm32cubemx.html) and [PlatformIO](https://platformio.org/).

Cube MX for MCU (NUCLEO-F303K8) device initialization code generating.

PlatformIO for code compiling, uploading and debugging.

## Basically code editing

Open `platform-io` directory on Visual Studio Code with PlatformIO extension. Then just editing sources.

For compiling, debugging and some operations of PlatformIO, [official tutorial](https://docs.platformio.org/en/latest/tutorials/ststm32/stm32cube_debugging_unit_testing.html) is available.

## Step of device configuration editing

1. Run `./src-copier.sh 1`
   - It copies sources from `platform-io` to `cube-mx`, for apply editing in PlatformIO to Cube MX.
2. Open `./cube-mx/web-dmx.ioc` with Cube MX
3. Edit device configurations, and generate code
4. Run `./src-copier.sh 0`
   - It copies sources from `cube-mx` to `platform-io`, for apply editing in Cube MX to PlatformIO.
