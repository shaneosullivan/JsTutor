---
id: 6
courseId: 1
title: "Making Decisions"
description: "Computer choices with if statements"
expectedOutput: "Alternating blue circles and red squares based on even/odd numbers"
order: 6
version: 1
---

## 🤔 What are IF statements?

Sometimes your program needs to make choices! An `if` statement lets the computer ask a question and then decide what to do based on the answer.

### 📝 Basic IF Syntax:

```javascript
if (condition) {
    // code to run if condition is true
}
```

### 🔍 Let's break this down:

- `if` is a special word (keyword) that starts the statement
- The round brackets `( )` contain a question that has a true/false answer
- The curly brackets `{ }` contain the code that runs ONLY if the answer is true
- Every line of code inside ends with a semicolon `;`

### ✅ Understanding TRUE and FALSE:

Computers think in true/false (called **boolean** values):

- `5 > 3` is **TRUE** (5 is greater than 3)
- `'red' === 'blue'` is **FALSE** (red does not equal blue)
- `i % 2 === 0` is **TRUE** when `i` is an even number

### 🔧 Comparison Operators (how to ask questions):

- `===` means 'exactly equal to'
- `!==` means 'not equal to'
- `>` means 'greater than'
- `<` means 'less than'
- `>=` means 'greater than or equal to'
- `<=` means 'less than or equal to'

### 🌟 Adding ELSE:

You can also tell the computer what to do if the condition is **FALSE**:

```javascript
if (condition) {
    // runs if TRUE
} else {
    // runs if FALSE
}
```

### 💡 The % operator:

The `%` symbol finds the remainder after division:

- `4 % 2 = 0` (4 divided by 2 = 2 remainder 0)
- `5 % 2 = 1` (5 divided by 2 = 2 remainder 1)
- This helps us find even/odd numbers!

### 🎨 New Drawing Function:

- `drawPixel(x, y, color)` - Draws a single tiny dot at a specific position!

### 🌟 Your Challenge:

Look at the code below. Can you:

1. Change the colors?
2. Try different conditions?
3. Add more shapes?