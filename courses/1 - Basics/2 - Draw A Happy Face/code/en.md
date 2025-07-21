---
version: 1
---

```javascript
// Let's do some maths and draw
// a happy face with it!

let x = 200; // Center of the face circle
let y = 200;
let radius = 100; // Size of the face circle

let leftEyeX = x - 50; // Center of the left eye
let leftEyeY = y - 40;

let rightEyeX = x + 45; // Center of the right eye
let rightEyeY = y - 10;

let eyeRadius = radius / 8; // Size of the eyes

let mouthX = x; // Top left corner of the mouth rectangle
let mouthY = y + 30;

let mouthWidth = radius / 2;
let mouthHeight = radius / 4;

drawCircle(x, y, radius, "yellow");
drawCircle(leftEyeX, leftEyeY, eyeRadius, "black");
drawCircle(rightEyeX, rightEyeY, eyeRadius, "black");
drawRect(mouthX, mouthY, mouthWidth, mouthHeight, "black");
```
