---
version: 1
---

```javascript
// Let's add some randomness!
clearCanvas();

// Draw 10 random circles
for (let i = 0; i < 10; i++) {
  let x = Math.floor(Math.random() * 400);
  let y = Math.floor(Math.random() * 400);
  let colors = ["red", "blue", "green", "purple", "orange"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  drawCircle(x, y, 15, randomColor);
}

// Try adding random rectangles too!
```
