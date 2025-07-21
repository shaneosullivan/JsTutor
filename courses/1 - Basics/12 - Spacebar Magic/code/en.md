---
version: 1
---

```javascript
// Spacebar creates colorful circles!
let playerX = 200;
let playerY = 200;
let circles = [];

// Move with arrow keys
onArrowKeys((direction, preventDefault) => {
  preventDefault();

  if (direction === "left") playerX -= 15;
  if (direction === "right") playerX += 15;
  if (direction === "up") playerY -= 15;
  if (direction === "down") playerY += 15;

  redrawEverything();
});

// Spacebar creates a circle!
onSpaceBar(() => {
  let colors = ["red", "blue", "green", "purple", "orange"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  circles.push({ x: playerX, y: playerY, color: randomColor });
  redrawEverything();
});

function redrawEverything() {
  clearCanvas();

  // Draw all circles
  for (let circle of circles) {
    drawCircle(circle.x, circle.y, 10, circle.color);
  }

  // Draw player
  drawRect(playerX, playerY, 20, 20, "black");
}

// Initial draw
redrawEverything();
```
