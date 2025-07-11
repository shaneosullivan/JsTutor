---
id: 18
courseId: 2
title: "filter - Keep Only Some Items"
description: "Create a new array with only the items you want"
expectedOutput: "Original array and filtered results displayed"
order: 3
version: 1
---

## filter - Keep Only Some Items

`filter` is like a **gatekeeper** that only lets certain items through to create a new array!

### 🔍 What You'll Learn:

- How `filter` selects items
- How to write conditions for filtering
- Creating subsets of your data

### Basic filter Syntax:

```javascript
let filtered = array.filter(item => {
    // Return true to keep, false to remove
    return item > 5;
});
```

### How It Works:

- `filter` tests each item with your condition
- If condition returns `true`, item is **kept**
- If condition returns `false`, item is **removed**
- Returns a **new array** with only the items that passed

### Common Filter Examples:

```javascript
// Keep even numbers
numbers.filter(n => n % 2 === 0);

// Keep long words
words.filter(word => word.length > 5);

// Keep positive numbers
numbers.filter(n => n > 0);
```

### 🌟 Your Challenge:

Try filtering for your favorite items, or numbers that meet certain conditions!