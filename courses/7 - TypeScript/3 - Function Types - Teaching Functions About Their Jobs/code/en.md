---
version: 1
---

```javascript
// Function Types in TypeScript!

printData("=== Learning Function Types ===");

// BASIC FUNCTION TYPES
printData("🔧 Basic Function Types:");

// In TypeScript: function add(a: number, b: number): number
function add(a, b) {
  return a + b;
}

// In TypeScript: function greet(name: string): string
function greet(name) {
  return "Hello, " + name + "!";
}

// In TypeScript: function isOldEnough(age: number): boolean
function isOldEnough(age) {
  return age >= 10;
}

printData("add(5, 3): " + add(5, 3));
printData("greet('Alice'): " + greet('Alice'));
printData("isOldEnough(9): " + isOldEnough(9));

// FUNCTIONS WITH NO RETURN VALUE
printData("\n📢 Functions That Don't Return Anything:");

// In TypeScript: function sayHello(name: string): void
function sayHello(name) {
  printData("Hello, " + name + "!");
  // No return statement - TypeScript calls this 'void'
}

sayHello("Bob");

// OPTIONAL PARAMETERS
printData("\n❓ Optional Parameters:");

// In TypeScript: function createMessage(name: string, greeting?: string): string
function createMessage(name, greeting) {
  if (greeting) {
    return greeting + ", " + name + "!";
  } else {
    return "Hello, " + name + "!";
  }
}

printData("With greeting: " + createMessage("Charlie", "Hi"));
printData("Without greeting: " + createMessage("Diana"));

// DEFAULT PARAMETERS
printData("\n⚡ Default Parameters:");

// In TypeScript: function multiply(a: number, b: number = 2): number
function multiply(a, b = 2) {
  return a * b;
}

printData("multiply(5): " + multiply(5));        // Uses default b = 2
printData("multiply(5, 3): " + multiply(5, 3));  // Uses provided b = 3

// ARROW FUNCTIONS WITH TYPES
printData("\n🏹 Arrow Functions with Types:");

// In TypeScript: const square = (x: number): number => x * x;
const square = (x) => x * x;

// In TypeScript: const getLength = (text: string): number => text.length;
const getLength = (text) => text.length;

// In TypeScript: const isEven = (num: number): boolean => num % 2 === 0;
const isEven = (num) => num % 2 === 0;

printData("square(4): " + square(4));
printData("getLength('hello'): " + getLength('hello'));
printData("isEven(6): " + isEven(6));

// FUNCTIONS THAT TAKE ARRAYS
printData("\n📋 Functions with Array Parameters:");

// In TypeScript: function sumArray(numbers: number[]): number
function sumArray(numbers) {
  let total = 0;
  for (let num of numbers) {
    total += num;
  }
  return total;
}

// In TypeScript: function joinNames(names: string[]): string
function joinNames(names) {
  return names.join(", ");
}

const testNumbers = [1, 2, 3, 4, 5];
const testNames = ["Alice", "Bob", "Charlie"];

printData("sumArray([1,2,3,4,5]): " + sumArray(testNumbers));
printData("joinNames(['Alice','Bob','Charlie']): " + joinNames(testNames));

// ERROR EXAMPLES - what TypeScript would catch
printData("\n🚫 What TypeScript Would Catch:");
printData("✅ add(5, 3) - Perfect!");
printData("❌ add('5', '3') - TypeScript: 'Numbers only!'");
printData("❌ greet(123) - TypeScript: 'String needed!'");
printData("❌ isOldEnough('nine') - TypeScript: 'Number needed!'");

// RETURN TYPE CHECKING
printData("\n🔍 Return Type Checking:");
printData("✅ add() returns a number - Good!");
printData("✅ greet() returns a string - Good!");
printData("✅ isOldEnough() returns a boolean - Good!");
printData("❌ If add() returned a string, TypeScript would complain!");

printData("\n🎯 Function types make your code super clear!");
```