---
id: "random-fun"
courseId: "basics"
title: "Random Fun"
description: "Add randomness to make things unpredictable"
expectedOutput: "Random colored circles scattered around"
order: 10
version: 1
---

## Random Fun

Random numbers make our programs exciting and **different every time**! It's like rolling dice in your code.

### 🎲 Random Magic:

- `Math.random()` gives us a number between `0` and `1`
- `Math.random() * 400` gives us a number between `0` and `400`
- `Math.floor()` removes the decimal part (`1.7` becomes `1`)
- This helps us get random positions on our canvas!

### Random Examples:

```javascript
let randomX = Math.floor(Math.random() * 400);  // 0 to 399
let randomY = Math.floor(Math.random() * 300);  // 0 to 299
drawCircle(randomX, randomY, 20, 'blue');
```

### 🌈 Random Ideas:

- Random positions for stars in the sky
- Random colors for a rainbow
- Random sizes for bubbles

### 🌟 Your Challenge:

Run your code multiple times and watch it change! Try adding more random elements - maybe random colors or sizes!