---
id: 26
courseId: 4
title: "Sorting Algorithms"
description: "Learn how to put things in order"
expectedOutput: "Comparison of bubble sort and selection sort algorithms"
order: 3
version: 1
---

## Sorting Algorithms

**Sorting** is putting things in order - like organizing your toys by size or alphabetically!

### 🔍 What You'll Learn:

- **Bubble sort** (compare neighbors)
- **Selection sort** (find the smallest)
- How different sorting methods work

### Sorting Examples:

```javascript
// Bubble Sort
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
```

### 🌟 Your Challenge:

Try sorting different types of data - numbers, words, or even custom objects!