---
id: 11
courseId: 1
title: "Moving Things"
description: "Learn to animate objects"
expectedOutput: "A red ball bouncing back and forth"
order: 11
version: 1
---

## Simple Animation

Animation makes things **move on screen**! We use `setInterval` to run code over and over, creating motion.

### ⏰ About setInterval:

- `setInterval(function, milliseconds)` runs code repeatedly
- `100` milliseconds = `0.1` seconds (pretty fast!)
- We change positions each time to create movement
- `clearCanvas()` erases the old drawing before drawing the new one

### Basic Animation:

```javascript
setInterval(() => {
    clearCanvas();              // Clear old drawing
    drawCircle(ballX, ballY, 20, 'red');  // Draw new position
    ballX += 2;                // Move ball right
}, 100);
```

### 🏃‍♀️ Movement Tips:

- Increase `x` to move right, decrease to move left
- Increase `y` to move down, decrease to move up
- Check boundaries to keep things on screen

### 🌟 Your Challenge:

Try changing the speed (`100` to `50` for faster, `200` for slower) or direction. Can you make the ball bounce off the edges?