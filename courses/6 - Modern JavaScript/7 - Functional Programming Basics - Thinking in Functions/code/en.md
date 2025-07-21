---
version: 1
---

```javascript
// Functional Programming - thinking in functions!

printData("=== Learning About Functional Programming ===");

// PURE FUNCTIONS - like math equations!
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const greet = (name) => `Hello, ${name}!`;

printData("📊 Pure Functions Always Give Same Results:");
printData("add(5, 3) = " + add(5, 3));
printData("add(5, 3) = " + add(5, 3)); // Same result!
printData("multiply(4, 6) = " + multiply(4, 6));
printData("greet('Alice') = " + greet('Alice'));

// IMPURE FUNCTIONS - they change things or depend on outside stuff
let counter = 0;
const impureAdd = (a, b) => {
  counter++; // Changes something outside!
  return a + b;
};

printData("\n❌ Impure Functions Can Give Different Results:");
printData("First call: " + impureAdd(2, 3) + " (counter: " + counter + ")");
printData("Second call: " + impureAdd(2, 3) + " (counter: " + counter + ")");

// IMMUTABILITY - don't change things, make new ones!
const originalArray = [1, 2, 3];

// BAD WAY - changing the original array
// originalArray.push(4); // This changes the original!

// GOOD WAY - creating a new array
const newArray = [...originalArray, 4]; // Spread operator creates new array!
printData("\n🔄 Immutability Example:");
printData("Original array: " + originalArray);
printData("New array: " + newArray);

// FUNCTIONAL ARRAY METHODS - these create new arrays instead of changing old ones!
const numbers = [1, 2, 3, 4, 5];

// Map - transform each item into something new
const doubledNumbers = numbers.map(num => num * 2);
printData("\n✨ Functional Array Methods:");
printData("Original: " + numbers);
printData("Doubled: " + doubledNumbers);

// Filter - create a new array with only some items
const evenNumbers = numbers.filter(num => num % 2 === 0);
printData("Even numbers: " + evenNumbers);

// Reduce - combine all items into one value
const sum = numbers.reduce((total, num) => total + num, 0);
printData("Sum of all numbers: " + sum);

// FUNCTION COMPOSITION - using functions together like building blocks!
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const square = x => x * x;

// Combining functions step by step
const result = square(multiplyByTwo(addOne(3)));
printData("\n🏗️ Function Composition:");
printData("Start with 3, add 1, multiply by 2, then square: " + result);

// Or using a helper function to make it cleaner
const compose = (f, g) => (x) => f(g(x));
const addOneAndDouble = compose(multiplyByTwo, addOne);
printData("Using compose helper: " + addOneAndDouble(3));

printData("\n🎯 Functional programming makes code predictable and safe!");
```