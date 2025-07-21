---
version: 1
---

```javascript
// Let's make a pattern with a loop!
for (let i = 0; i < 5; i++) {
  // Can you see why the circles are spaced out?
  drawCircle(50 + i * 60, 200, 20, "purple");
}

// Try making a different pattern!
for (let i = 0; i < 3; i++) {
  // Can you see why the squares start further right
  // than the circles?
  drawRect(100 + i * 80, 300, 40, 40, "orange");
}
```
