---
id: "advanced-repeating"
courseId: "basics"
title: "Advanced Repeating"
description: "Learn for loops - a more powerful way to repeat"
expectedOutput: "A diagonal pattern of purple squares with yellow circles"
order: 5
version: 1
---

## Advanced Repeating with For Loops

`For` loops are a more compact way to write loops! They put the counter, condition, and increment all in one line.

### 🚀 For Loop Structure:

```javascript
for (start; condition; increment) {
    // code to repeat
}
```

Breaking it down:

- `let i = 0` (start counting at 0)
- `i < 5` (keep going while `i` is less than 5)
- `i++` (add 1 to `i` each time - same as `i += 1`)

### 🔄 For vs While:

- **For loops** are more compact when you know how many times to repeat
- **While loops** are clearer when the condition is more complex
- Both do the same thing, just written differently!

### 🌟 Your Challenge:

Try changing the `for` loop numbers! What happens if you change `i < 5` to `i < 8`? Can you make a diagonal pattern by changing the `y` position too?