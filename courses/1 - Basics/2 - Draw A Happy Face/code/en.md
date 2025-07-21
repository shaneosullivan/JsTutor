---
version: 1
---

```javascript
// Let's do some maths and draw
// a happy face with it!
let x = 200;
let y = 200;
let radius = 100; // This equals 30!

let leftEyeX = x - 30;
let rightEyeX = x + 30;
let leftEyeY = y - 30;
let rightEyeY = y - 30;

let eyeRadius = radius / 5;

drawCircle(x, y, radius, "yellow");
drawCircle(leftEyeX, leftEyeY, eyeRadius, "black");
drawCircle(rightEyeX, rightEyeY, eyeRadius, "black");
```
