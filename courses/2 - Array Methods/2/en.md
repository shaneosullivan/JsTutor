---
id: 2
courseId: 2
title: "map - Transform Each Item"
description: "Create a new array by changing each item"
expectedOutput: "Original and transformed arrays displayed"
order: 2
version: 1
---

## map - Transform Each Item

`map` is like a **factory** that takes each item in your array, transforms it, and creates a **new array** with the results!

### 🔍 What You'll Learn:

- How `map` transforms arrays
- The difference between `map` and `forEach`
- How to create new arrays from existing ones

### Basic map Syntax:

```javascript
let newArray = oldArray.map(item => {
    // Transform the item
    return item * 2;
});
```

### Key Differences:

- **`forEach`**: Loops through items, doesn't return anything
- **`map`**: Transforms items and **returns a new array**
- **Original array**: Never changed by `map`

### Example:

```javascript
let numbers = [1, 2, 3];
let doubled = numbers.map(n => n * 2);  // [2, 4, 6]
// numbers is still [1, 2, 3]
```

### 🌟 Your Challenge:

Try mapping numbers to their squares, or words to their lengths!