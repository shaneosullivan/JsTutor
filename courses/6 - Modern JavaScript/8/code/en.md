---
version: 1
---

```javascript
// Higher-Order Functions - functions that use other functions!

printData("=== Learning About Higher-Order Functions ===");

// Let's start with some simple functions
const double = x => x * 2;
const triple = x => x * 3;
const square = x => x * x;

// HIGHER-ORDER FUNCTION - takes a function as a parameter!
const applyToArray = (array, transformFunction) => {
  const result = [];
  for (let item of array) {
    result.push(transformFunction(item));
  }
  return result;
};

const numbers = [1, 2, 3, 4, 5];

printData("🔧 Using Higher-Order Functions:");
printData("Original numbers: " + numbers);
printData("Doubled: " + applyToArray(numbers, double));
printData("Tripled: " + applyToArray(numbers, triple));
printData("Squared: " + applyToArray(numbers, square));

// Built-in higher-order functions in JavaScript!
printData("\n✨ Built-in Higher-Order Functions:");

// MAP - transform each item
const doubledWithMap = numbers.map(double);
printData("Using map to double: " + doubledWithMap);

// FILTER - keep only items that pass a test
const isEven = x => x % 2 === 0;
const evenNumbers = numbers.filter(isEven);
printData("Even numbers: " + evenNumbers);

// REDUCE - combine all items into one value
const addAll = (total, current) => total + current;
const sum = numbers.reduce(addAll, 0);
printData("Sum of all numbers: " + sum);

// FOREACH - do something with each item
printData("\nUsing forEach:");
numbers.forEach(num => {
  printData(`Number: ${num}, Doubled: ${double(num)}`);
});

// CREATING YOUR OWN HIGHER-ORDER FUNCTIONS!
const createMultiplier = (factor) => {
  return (x) => x * factor;
};

const multiplyByTen = createMultiplier(10);
const multiplyByHundred = createMultiplier(100);

printData("\n🏭 Creating Function Factories:");
printData("5 × 10 = " + multiplyByTen(5));
printData("5 × 100 = " + multiplyByHundred(5));

// FUNCTION THAT RETURNS DIFFERENT FUNCTIONS
const createGreeter = (greeting) => {
  return (name) => `${greeting}, ${name}!`;
};

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");
const sayHowdy = createGreeter("Howdy");

printData("\n👋 Different Greeters:");
printData(sayHello("Alice"));
printData(sayHi("Bob"));
printData(sayHowdy("Charlie"));

// CHAINING HIGHER-ORDER FUNCTIONS
const result = numbers
  .filter(x => x > 2)        // Keep numbers > 2
  .map(x => x * x)           // Square them
  .reduce((a, b) => a + b);  // Add them up

printData("\n🔗 Chaining Functions:");
printData("Numbers > 2, squared, then summed: " + result);

printData("\n🎯 Higher-order functions make code super flexible!");
```