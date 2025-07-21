---
id: "searching-algorithms"
courseId: "algorithms"
title: "Searching Algorithms"
description: "Learn different ways to find things in lists"
expectedOutput: "Comparison of linear and binary search algorithms"
order: 2
version: 1
---

## Searching Algorithms

There are many ways to **search for items** in a list. Let's explore the most common ones!

### 🔍 What You'll Learn:

- **Linear search** (checking each item one by one)
- **Binary search** (for sorted lists)
- When to use each method

### Search Types:

```javascript
// Linear Search - check each item
function linearSearch(array, target) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) return i;
    }
    return -1; // Not found
}

// Binary Search - for sorted arrays
function binarySearch(array, target) {
    let left = 0, right = array.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] === target) return mid;
        if (array[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

### 🌟 Your Challenge:

Try searching for different items and see how many steps each algorithm takes!