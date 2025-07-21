---
version: 1
---

```javascript
// Let's make an interactive drawing!
let x = 200;
let y = 200;

// Clear the canvas first
clearCanvas();

// Draw our starting position
drawCircle(x, y, 10, "blue");

// Listen for arrow keys
onArrowKeys((direction) => {
  // Move based on arrow key direction
  if (direction === "up") y -= 10;
  if (direction === "down") y += 10;
  if (direction === "left") x -= 10;
  if (direction === "right") x += 10;

  // Clear and redraw
  clearCanvas();
  drawCircle(x, y, 10, "blue");
});

// Listen for spacebar to change color
onSpaceBar(() => {
  clearCanvas();
  drawCircle(x, y, 10, "red");
});
```
