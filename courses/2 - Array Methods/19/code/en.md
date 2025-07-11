---
version: 1
---

```javascript
// Let's use reduce to combine things!
let numbers = [1, 2, 3, 4, 5];

printData("Numbers to add:");
printData(numbers);

// Add all numbers together
let sum = numbers.reduce((total, number) => total + number, 0);
printData("Sum of all numbers:");
printData(sum);

// Find the largest number
let largest = numbers.reduce((biggest, number) => {
  return number > biggest ? number : biggest;
}, numbers[0]);
printData("Largest number:");
printData(largest);

// Let's try with words
let words = ["Hello", "world", "this", "is", "awesome"];
printData("Words to combine:");
printData(words);

// Combine all words into one sentence
let sentence = words.reduce((text, word) => text + " " + word, "");
printData("Combined sentence:");
printData(sentence);
```
