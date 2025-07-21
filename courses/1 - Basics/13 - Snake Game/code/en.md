---
version: 1
---

```javascript
// Snake Game!
let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = { x: 160, y: 160 }; // Fixed: align to 20px grid
let gameOver = false;

// Game loop
setInterval(() => {
  if (gameOver) return;

  // Move snake
  let head = { ...snake[0] };
  if (direction === "up") head.y -= 20;
  if (direction === "down") head.y += 20;
  if (direction === "left") head.x -= 20;
  if (direction === "right") head.x += 20;

  // Check walls
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
    gameOver = true;
    return;
  }

  // Check self collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      return;
    }
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    // Generate new food position (aligned to 20px grid)
    food = {
      x: Math.floor(Math.random() * 19) * 20, // 0-18 * 20 = 0-360
      y: Math.floor(Math.random() * 19) * 20, // 0-18 * 20 = 0-360
    };
  } else {
    snake.pop();
  }

  // Draw everything
  clearCanvas();

  // Draw snake
  for (let segment of snake) {
    drawRect(segment.x, segment.y, 20, 20, "green");
  }

  // Draw food
  drawRect(food.x, food.y, 20, 20, "red");

  if (gameOver) {
    drawText(150, 200, "Game Over!", "black");
    drawText(120, 230, "Press Space to Restart", "black");
  }
}, 200);

// Controls
onArrowKeys((dir) => {
  if (dir === "up" && direction !== "down") direction = "up";
  if (dir === "down" && direction !== "up") direction = "down";
  if (dir === "left" && direction !== "right") direction = "left";
  if (dir === "right" && direction !== "left") direction = "right";
});

onSpaceBar(() => {
  if (gameOver) {
    snake = [{ x: 200, y: 200 }];
    direction = "right";
    food = { x: 160, y: 160 }; // Fixed: align to 20px grid
    gameOver = false;
  }
});
```
