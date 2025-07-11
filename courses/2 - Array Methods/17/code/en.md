---
version: 1
---

```javascript
// Let's transform an array with map!
let numbers = [1, 2, 3, 4, 5];

printData("Original numbers:");
printData(numbers);

// Create a new array with each number squared
let squared = numbers.map((number) => number * number);
printData("Squared numbers:");
printData(squared);

// Let's try with words
let words = ["cat", "dog", "elephant", "ant"];
printData("Original words:");
printData(words);

// Create a new array with word lengths
let lengths = words.map((word) => word.length);
printData("Word lengths:");
printData(lengths);

// Make them all uppercase
let uppercase = words.map((word) => word.toUpperCase());
printData("Uppercase words:");
printData(uppercase);
```
