---
id: 27
courseId: 4
title: "Introduction to Recursion"
description: "Learn how functions can call themselves"
expectedOutput: "Step-by-step recursive calculations for factorial, sum, and Fibonacci"
order: 4
version: 1
---

## Introduction to Recursion

**Recursion** is when a function calls itself! It's like looking in a mirror that reflects another mirror.

### 🔍 What You'll Learn:

- What recursion is
- How to write recursive functions
- When recursion is useful

### Recursion Basics:

```javascript
// Recursive function needs:
// 1. Base case (when to stop)
// 2. Recursive case (calling itself)

function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}
```

### 🌟 Your Challenge:

Try writing your own recursive function to solve a problem!