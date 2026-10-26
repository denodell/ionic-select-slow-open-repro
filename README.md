# ion-select repro

An `ion-select` with the popover interface takes much longer to open as its list of options grows, and the page stops responding for most of that time. Each option takes longer to add than the last one, so five times as many options takes more than five times as long.

## Run it

```sh
npm install
npm start
```

Then open the page it serves, pick 50, 125 or 249 options, and click the select to open it. The table shows how long it took from the click until the popover had finished presenting, and the longest frame while it opened.

## What you'll see

On an M1 Pro MacBook Pro in Chrome 155, with the CPU slowed down 4x, opening it took 203ms with 50 options and 1,266ms with 249, and the page was unresponsive for 1,133ms of that.

## Where it comes from

In a Performance panel recording of the select opening, most of the time is in Stencil's replacement `appendChild` and `insertBefore`, which Ionic turns on through `experimentalSlotFixes`. `ion-radio-group` doesn't use shadow DOM, so each time an `ion-radio` is added, Stencil checks all the options already in the group to find the right slot, then checks them all again to work out where the new one goes.

The same behavior in Stencil on its own: https://github.com/denodell/stencil-slot-append-repro

Versions: `@ionic/core` 9.0.7.
