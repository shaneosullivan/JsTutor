---
id: 7
courseId: 6
title: "Functional Programming Basics - Thinking in Functions"
description: "Learn about functional programming - a cool way to solve problems using functions!"
expectedOutput: "Examples showing functional programming concepts like pure functions"
order: 7
version: 1
---

## What is Functional Programming?

Functional programming is a **cool way of thinking** about solving problems! Instead of changing things, you create **new things** using functions. It's like using a **magic recipe** that always gives you the same result!

### 🤔 Why is Functional Programming Cool?

1. **Predictable** - The same input always gives the same output
2. **Safe** - You don't accidentally break things
3. **Reusable** - You can use the same functions everywhere
4. **Easy to test** - Functions are like math equations!

### 🎯 Key Ideas:

**Pure Functions** - Like a math equation:
- Always return the same result for the same input
- Don't change anything outside themselves
- No side effects (no printing, no changing variables)

**Immutability** - Don't change things, make new ones:
- Instead of changing an array, create a new one
- Instead of changing an object, create a new one

### 📝 Pure vs Impure Functions:

**Pure Function** (Good! 👍):
```javascript
const add = (a, b) => a + b; // Always returns the same result
```

**Impure Function** (Not pure 👎):
```javascript
let counter = 0;
const addAndCount = (a, b) => {
  counter++; // Changes something outside!
  return a + b;
};
```

### 🚀 Your Mission:

Learn to write pure functions and think functionally!