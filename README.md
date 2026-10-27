# ion-select repro

An `ion-select` with the popover interface takes much longer to open as its list of options grows, and the page stops responding for most of that time. Each option takes longer to add than the last one, so five times as many options takes more than five times as long.

To run it:

```sh
npm install
npm start
```

Then open the page it serves, pick 50, 125 or 250 options, and click the select to open it. The table shows how long it took from the click until the popover was on screen, and the longest frame while it opened.

With the CPU slowed down 4x, opening it with 250 options takes four to five times as long as with 50, and most of that time the page is unresponsive.

In a Performance panel recording of the select opening, most of the time is in Stencil's replacement `appendChild` and `insertBefore`, which Ionic turns on through `experimentalSlotFixes`. `ion-radio-group` doesn't use shadow DOM, so each time an `ion-radio` is added, Stencil checks all the options already in the group to find the right slot, then checks them again to work out where the new one goes. After adding it, Stencil goes through all the options a third time to decide whether to show the slot's fallback content, and that third check takes most of the time.

There's a repro of the same behavior in Stencil on its own at https://github.com/denodell/stencil-slot-append-repro.

Versions: `@ionic/core` 9.0.7.
