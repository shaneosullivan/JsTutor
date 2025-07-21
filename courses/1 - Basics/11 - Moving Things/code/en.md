---
version: 1
---

```javascript
// Let's make a moving ball!
let ballX = 50;
let ballY = 200;
let speedX = 2;

setInterval(() => {
  clearCanvas();
  drawCircle(ballX, ballY, 20, "red");
  ballX = ballX + speedX;

  // Bounce off edges
  if (ballX > 380 || ballX < 20) {
    speedX = -speedX;
  }
}, 100);
```
