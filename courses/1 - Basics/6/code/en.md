---
version: 1
---

```javascript
// Let's make the computer choose colors!
// This loop runs 10 times, with i going from 0 to 9
for (let i = 0; i < 10; i++) {
  // Calculate position for each shape
  let x = i * 40; // Spread them across the canvas
  let y = 200; // Keep them at the same height

  // Ask: "Is i an even number?"
  if (i % 2 === 0) {
    // If TRUE (even): draw a blue circle
    drawCircle(x, y, 20, "blue");
  } else {
    // If FALSE (odd): draw a red square
    drawRect(x - 10, y - 10, 20, 20, "red");
  }

  // Try changing this! What if you used:
  // if (i > 5) {
  //     drawCircle(x, y, 20, 'green');
  // } else {
  //     drawCircle(x, y, 20, 'purple');
  // }
}
```
