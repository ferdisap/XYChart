import { Shape } from "konva/lib/Shape";

export function handleDoubleClick(anchor: Shape, onDoubleClick: Function, onSingleClick:Function|null) {
  let clickTimer = 0;
  let lastClickTime = 0;
  const DBLCLICK_THRESHOLD = 300; // milliseconds
  anchor.on('click', function (evt) {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < DBLCLICK_THRESHOLD) {
        // This is a potential double-click
        clearTimeout(clickTimer); // Clear the pending single-click
        onDoubleClick(evt);
        lastClickTime = 0; // Reset for the next sequence
      } else {
        // This is a single click, or the first click of a potential double-click
        lastClickTime = currentTime;
        clickTimer = setTimeout(() => {
          lastClickTime = 0; // Reset after single click
          // handleSingleClick() here;
          if(onSingleClick) onSingleClick(evt);
        }, DBLCLICK_THRESHOLD);
      }
    });
}