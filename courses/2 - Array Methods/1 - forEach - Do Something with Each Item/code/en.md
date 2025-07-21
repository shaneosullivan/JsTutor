---
version: 1
---

```javascript
// Let's use forEach to go through an array!
let numbers = [2, 4, 6, 8, 10];

printData("Original array:");
printData(numbers);

printData("Each number doubled:");
numbers.forEach((number, index) => {
  let doubled = number * 2;
  printData(`Position ${index}: ${number} doubled is ${doubled}`);
});

// Let's try with names
let names = ["Alice", "Bob", "Charlie"];
printData("Greeting each person:");
names.forEach((name) => {
  printData(`Hello, ${name}!`);
});
```
