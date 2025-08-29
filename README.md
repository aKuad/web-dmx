# Web DMX

DMX control on web application

![GitHub Release](https://img.shields.io/github/v/release/aKuad/web-dmx)

[UI demo is available.](https://akuad.github.io/web-dmx/ui-demo/)

[Develop documentation is here.](https://akuad.github.io/web-dmx/)

![Head image](./assets/head-image.gif)

## Usage

Work in progress

## Deployment

### 1. Device setting up

Open `src_fw` directory by [VSCode](https://code.visualstudio.com/) with [PlatformIO extension](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide). Then set environment 'nucleo_f303k8', and upload.

![VSCode PlatformIO upload](./assets/vscode-upload.webp)

Or you'd like to use CLI:

```sh
wget -O get-platformio.py https://raw.githubusercontent.com/platformio/platformio-core-installer/master/get-platformio.py
python3 get-platformio.py
rm get-platformio.py

cd src_fw/platform-io
pio run -e nucleo_f303k8 -t upload
```

### 2. WebApp setting up

Work in progress

### 3. Client access

Access to `http://<server-address>:8000/`. Now controller is ready.

> [!NOTE]
>
> On your local, `<server-address>` will be `localhost`.

## Using packages

None

## License

[CC0 1.0](./LICENSE)
