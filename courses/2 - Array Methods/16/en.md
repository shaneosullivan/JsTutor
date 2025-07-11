---
id: 16
courseId: 2
title: "forEach - Do Something with Each Item"
description: "Loop through arrays the easy way"
expectedOutput: "Each array item processed and displayed"
order: 1
version: 1
---

## forEach - Do Something with Each Item

`forEach` is like a **magic loop** that goes through each item in your array automatically!

### 🔍 What You'll Learn:

- How `forEach` works
- How to access each item and its position
- Why `forEach` is better than regular `for` loops for arrays

### Basic forEach Syntax:

```javascript
array.forEach((item, index) => {
    // Do something with each item
    console.log(item);
});
```

### How It Works:

- **First parameter** (`item`) is the current array element
- **Second parameter** (`index`) is the position (0, 1, 2...)
- Automatically loops through **every** item
- Much cleaner than traditional `for` loops!

### 🌟 Your Challenge:

Try using `forEach` with your own array. Maybe an array of your favorite colors or numbers!