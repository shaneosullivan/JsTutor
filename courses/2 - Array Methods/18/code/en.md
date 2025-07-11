---
version: 1
---

```javascript
// Let's filter an array!
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

printData("All numbers:");
printData(numbers);

// Keep only even numbers
let evenNumbers = numbers.filter((number) => number % 2 === 0);
printData("Even numbers only:");
printData(evenNumbers);

// Keep only numbers greater than 5
let bigNumbers = numbers.filter((number) => number > 5);
printData("Numbers greater than 5:");
printData(bigNumbers);

// Let's try with words
let animals = ["cat", "dog", "elephant", "ant", "bear"];
printData("All animals:");
printData(animals);

// Keep only animals with more than 3 letters
let longNames = animals.filter((animal) => animal.length > 3);
printData("Animals with long names:");
printData(longNames);
```
