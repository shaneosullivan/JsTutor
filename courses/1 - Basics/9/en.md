---
id: 9
courseId: 1
title: "Making Patterns"
description: "Use loops to create repeating patterns"
expectedOutput: "A pattern of purple circles and orange squares"
order: 9
version: 1
---

## Making Patterns

Loops help us repeat code without writing it over and over! It's like telling the computer **'do this 10 times'**.

### 🔄 About Loops:

- A `for loop` repeats code a certain number of times
- We use `i` as a **counter** that changes each time
- The loop runs while `i` is less than the number we set

### ✨ Loop Magic:

- `i` starts at `0`, then becomes `1, 2, 3`, and so on
- We can use `i` in our drawing to make patterns
- `i * 50` means: `0, 50, 100, 150...` (perfect for spacing!)

### Pattern Example:

```javascript
for (let i = 0; i < 5; i++) {
    drawCircle(50 + i * 60, 200, 20, 'purple');
}
```

### 🌟 Your Challenge:

Create your own pattern! Try changing the numbers, colors, or shapes. What happens if you use `i` for the color or size?