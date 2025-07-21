---
version: 1
---

```javascript
// Let's draw a pattern with a for loop!
for (let i = 0; i < 5; i++) {
  let x = i * 60;
  let y = i * 40;
  drawRect(x, y, 40, 40, "purple");
  drawCircle(x + 20, y + 20, 15, "yellow");
}

// Compare to while loop way:
// let i = 0;
// while (i < 5) {
//     let x = i * 60;
//     let y = i * 40;
//     drawRect(x, y, 40, 40, 'purple');
//     drawCircle(x + 20, y + 20, 15, 'yellow');
//     i++;
// }
```
