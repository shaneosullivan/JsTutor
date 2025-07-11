---
version: 1
---

```javascript
// Let's draw with a while loop!
let i = 0; // Start counting at 0

while (i < 5) {
  // Keep going while i is less than 5
  let x = 50 + i * 60; // Space circles out
  let y = 200;

  drawCircle(x, y, 25, "blue");
  drawText(x - 5, y + 5, i + 1, "white"); // Show the number

  i += 1; // Very important! Add 1 to i each time
}

drawText(50, 100, "Drew " + i + " circles!", "black");
```
