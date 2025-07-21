---
id: "simple-repeating"
courseId: "basics"
title: "Simple Repeating"
description: "Learn while loops - the easiest way to repeat code"
expectedOutput: "5 blue circles in a row with numbers inside"
order: 4
version: 1
---

## Simple Repeating with While Loops

`While` loops are the simplest way to repeat code! They keep going 'while' something is true.

### 🔄 How While Loops Work:

- `while (condition)` means 'keep doing this while condition is true'
- We need a **counter variable** to track how many times we've done something
- We **must change the counter** inside the loop or it will go forever!
- Much easier to understand than `for` loops

### Basic Structure:

```javascript
let i = 0;              // Start counter
while (i < 5) {         // Keep going while true
    // do something
    i += 1;             // IMPORTANT: change counter!
}
```

### 🎨 New Drawing Function:

- `drawLine(x1, y1, x2, y2, color)` - Draws a line from one point to another! The first two numbers `(x1, y1)` are where the line starts, and the next two `(x2, y2)` are where it ends.

### 🌟 Your Challenge:

Try changing the condition! What happens if you change `i < 5` to `i < 8`? Can you make the circles change color each time?