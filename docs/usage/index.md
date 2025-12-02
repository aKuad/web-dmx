# Usage

Here is a client UI usage guide.

## Channel fader tab

The faders can be switch to show only 64 channels.

![Fader tab - key control](./tabs-key-control.gif)

Key control is also available. Ctrl + 1...9 key, then select a tab 'All'...'449-'.

## Channel value control

The faders can control with mouse or cursor keys.

Mouse control:

![Channel value - mouse control](./values-mouse-control.gif)

Cursor key control:

![Channel value - key control](./values-key-control.gif)

- left/right key
  - Change current channel (current channel is red background)
- left/right key with holding:
  - Shift: 5 channel/step
  - Ctrl: 20 channel/step
  - Alt: 50 channel/step
- up/down key
  - Current channel value increase/decrease
- up/down key with holding:
  - Shift: 10 value/step
  - Ctrl: 50 value/step
  - Alt: 255 value/step

You'd like to try it? [UI demo is available.](https://akuad.github.io/web-dmx/ui-demo/)

## User label

You can write custom text above each faders.

![User label](./user-label.webp)

Note: Labels won't be synchronized with other devices. The view applies only own device.
