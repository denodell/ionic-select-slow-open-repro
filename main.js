import "@ionic/core/css/core.css";
import { initialize } from "@ionic/core/components";
import { defineCustomElement as defineSelect } from "@ionic/core/components/ion-select.js";
import { defineCustomElement as defineOption } from "@ionic/core/components/ion-select-option.js";
import { defineCustomElement as definePopover } from "@ionic/core/components/ion-popover.js";
import { defineCustomElement as defineSelectPopover } from "@ionic/core/components/ion-select-popover.js";

initialize();
defineSelect();
defineOption();
definePopover();
defineSelectPopover();

let count = 0;
let start = 0;
let frames = [];
let observer;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function build(n) {
  count = n;
  const stage = document.getElementById("stage");
  stage.innerHTML = "";
  const select = document.createElement("ion-select");
  select.label = `Country (${n} options)`;
  select.interface = "popover";
  for (let i = 0; i < n; i++) {
    const option = document.createElement("ion-select-option");
    option.value = `option-${i}`;
    option.textContent = `Option ${i}`;
    select.append(option);
  }
  stage.append(select);
}

document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest("ion-select")) return;
  start = performance.now();
  frames = [];
  observer = new PerformanceObserver((list) => frames.push(...list.getEntries().map((f) => f.duration)));
  observer.observe({ type: "long-animation-frame" });
}, true);

document.addEventListener("ionPopoverDidPresent", async () => {
  await nextFrame();
  await nextFrame();
  const ms = performance.now() - start;
  await new Promise((resolve) => setTimeout(resolve, 100));
  observer.disconnect();
  const longest = Math.max(0, ...frames);
  document.getElementById("results").insertAdjacentHTML("beforeend",
    `<tr><td>${count}</td><td>${Math.round(ms)}ms</td><td>${longest > 0 ? `${Math.round(longest)}ms` : "under 50ms"}</td></tr>`);
  window.__opened = (window.__opened ?? 0) + 1;
});

for (const button of document.querySelectorAll("button[data-count]")) {
  button.addEventListener("click", () => build(Number(button.dataset.count)));
}
build(250);
