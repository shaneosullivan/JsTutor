---
version: 1
---

```javascript
// Arrow functions - the cool new way to write functions!

printData("=== Comparing Regular Functions vs Arrow Functions ===");

// OLD WAY - Regular function (long and old-fashioned)
function oldGreeting(name) {
  return "Hello, " + name + "!";
}

// NEW WAY - Arrow function (short and cool!)
const newGreeting = (name) => "Hello, " + name + "!";

// Let's test them both
printData("Regular function: " + oldGreeting("Alice"));
printData("Arrow function: " + newGreeting("Bob"));

// Arrow functions with different numbers of parameters:

// No parameters (use empty parentheses)
const sayHello = () => "Hello, World!";
printData("No parameters: " + sayHello());

// One parameter (parentheses are optional)
const double = x => x * 2;
printData("One parameter: " + double(5));

// Multiple parameters (need parentheses)
const add = (a, b) => a + b;
printData("Two parameters: " + add(3, 4));

// Multiple lines (need curly braces and return)
const createMessage = (name, age) => {
  let message = `Hi, I'm ${name}!`;
  message += ` I'm ${age} years old.`;
  return message;
};
printData("Multiple lines: " + createMessage("Charlie", 9));

// Arrow functions are great with arrays!
const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map(num => num * 2);
printData("Doubled numbers: " + doubledNumbers);

// Try creating your own arrow function!
const myArrowFunction = (word) => `${word} is awesome!`;
printData("Your arrow function: " + myArrowFunction("JavaScript"));
```