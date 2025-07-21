---
version: 1
---

```javascript
// Let's practice maths shortcuts!
let score = 0;
let lives = 5;
let size = 20;
let x = 50;

// Show starting values
drawText(50, 50, "Starting Score: " + score, "black");
drawText(50, 70, "Starting Lives: " + lives, "black");

// Using += to add to score
score += 25; // Same as: score = score + 25
drawRect(x, 100, size, size, "blue");
drawText(x, 130, "Score: " + score, "blue");

// Using -= to subtract from lives
lives -= 1; // Same as: lives = lives - 1
x += 80;
drawRect(x, 100, size, size, "orange");
drawText(x, 130, "Lives: " + lives, "orange");

// Using *= to multiply size
size *= 2; // Same as: size = size * 2
x += 100;
drawRect(x, 100, size, size, "red");
drawText(x, 150, "Size: " + size, "red");

// Using /= to divide size back down
size /= 2; // Same as: size = size / 2
score += 100; // Add bonus points!
x += 120;
drawRect(x, 100, size, size, "green");
drawText(x, 130, "Final Score: " + score, "green");
```
