---
id: 1
courseId: 4
title: "What Are Algorithms?"
description: "Learn what algorithms are and why they're important"
expectedOutput: "Algorithm results for finding largest number and checking palindromes"
order: 1
version: 1
---

## What Are Algorithms?

An **algorithm** is like a recipe - it's a set of steps to solve a problem!

### 🔍 What You'll Learn:

- What algorithms are
- How to break down problems into steps
- Why algorithms are everywhere

### Algorithm Examples:

```javascript
// Algorithm to find largest number
function findLargest(numbers) {
    let largest = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > largest) {
            largest = numbers[i];
        }
    }
    return largest;
}
```

### 🌟 Your Challenge:

Try creating your own algorithm to solve a simple problem!