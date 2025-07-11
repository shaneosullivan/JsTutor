---
id: 19
courseId: 2
title: "reduce - Combine All Items"
description: "Combine all array items into a single value"
expectedOutput: "Various combinations and calculations displayed"
order: 4
version: 1
---

## reduce - Combine All Items

`reduce` is like a **blender** that combines all your array items into one result!

### 🔍 What You'll Learn:

- How `reduce` combines items
- How to use an **accumulator**
- Common `reduce` patterns

### Basic reduce Syntax:

```javascript
let result = array.reduce((accumulator, item) => {
    // Combine accumulator with current item
    return accumulator + item;
}, startingValue);
```

### How It Works:

- **Accumulator**: The running total/result so far
- **Item**: Current array element being processed
- **Starting value**: What to begin with (often `0` or `''`)
- Returns: Single combined value

### Common reduce Examples:

```javascript
// Sum all numbers
numbers.reduce((sum, n) => sum + n, 0);

// Find maximum
numbers.reduce((max, n) => n > max ? n : max);

// Join words
words.reduce((sentence, word) => sentence + ' ' + word, '');
```

### 🌟 Your Challenge:

Try using `reduce` to find the longest word, or to count how many times each item appears!