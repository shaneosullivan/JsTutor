---
version: 1
---

```javascript
// Generics in TypeScript!

printData("=== Learning About Generics ===");

// BASIC GENERIC FUNCTION
printData("🔧 Basic Generic Functions:");

// In TypeScript: function identity<T>(value: T): T { return value; }
function identity(value) {
  return value;
}

// TypeScript would infer the types automatically
let numberResult = identity(42);        // T becomes number
let stringResult = identity("hello");   // T becomes string
let booleanResult = identity(true);     // T becomes boolean

printData("Identity number: " + numberResult);
printData("Identity string: " + stringResult);
printData("Identity boolean: " + booleanResult);

// GENERIC ARRAY FUNCTIONS
printData("\n📋 Generic Array Functions:");

// In TypeScript: function getFirst<T>(items: T[]): T | undefined
function getFirst(items) {
  return items.length > 0 ? items[0] : undefined;
}

// In TypeScript: function getLast<T>(items: T[]): T | undefined
function getLast(items) {
  return items.length > 0 ? items[items.length - 1] : undefined;
}

let numbers = [1, 2, 3, 4, 5];
let names = ["Alice", "Bob", "Charlie"];
let colors = ["red", "blue", "green"];

printData("First number: " + getFirst(numbers));
printData("Last name: " + getLast(names));
printData("First color: " + getFirst(colors));

// GENERIC FUNCTIONS WITH MULTIPLE PARAMETERS
printData("\n🔄 Generic Functions with Multiple Parameters:");

// In TypeScript: function swap<T>(a: T, b: T): [T, T]
function swap(a, b) {
  return [b, a];
}

let [newNum1, newNum2] = swap(5, 10);
let [newName1, newName2] = swap("Alice", "Bob");

printData("Swapped numbers: " + newNum1 + " and " + newNum2);
printData("Swapped names: " + newName1 + " and " + newName2);

// GENERIC INTERFACES
printData("\n📦 Generic Interfaces:");

// In TypeScript: interface Container<T> { value: T; getValue(): T; setValue(value: T): void; }
function createContainer(initialValue) {
  return {
    value: initialValue,
    getValue: function() {
      return this.value;
    },
    setValue: function(newValue) {
      this.value = newValue;
    }
  };
}

let numberContainer = createContainer(42);
let stringContainer = createContainer("Hello");

printData("Number container: " + numberContainer.getValue());
printData("String container: " + stringContainer.getValue());

numberContainer.setValue(100);
stringContainer.setValue("World");

printData("Updated number: " + numberContainer.getValue());
printData("Updated string: " + stringContainer.getValue());

// GENERIC ARRAY UTILITIES
printData("\n🛠️ Generic Array Utilities:");

// In TypeScript: function findItem<T>(items: T[], predicate: (item: T) => boolean): T | undefined
function findItem(items, predicate) {
  for (let item of items) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

// In TypeScript: function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[]
function filterItems(items, predicate) {
  let result = [];
  for (let item of items) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}

let ages = [8, 9, 10, 11, 12];
let words = ["cat", "dog", "elephant", "ant"];

let firstTeenAge = findItem(ages, age => age >= 10);
let longWords = filterItems(words, word => word.length > 3);

printData("First teen age: " + firstTeenAge);
printData("Long words: " + longWords.join(", "));

// GENERIC FACTORY FUNCTIONS
printData("\n🏭 Generic Factory Functions:");

// In TypeScript: function createPair<T, U>(first: T, second: U): { first: T; second: U }
function createPair(first, second) {
  return {
    first: first,
    second: second
  };
}

let nameAndAge = createPair("Alice", 9);
let colorAndNumber = createPair("blue", 42);
let booleanAndString = createPair(true, "success");

printData("Name and age: " + nameAndAge.first + " is " + nameAndAge.second);
printData("Color and number: " + colorAndNumber.first + " number " + colorAndNumber.second);
printData("Boolean and string: " + booleanAndString.first + " means " + booleanAndString.second);

// GENERIC COMPARISON FUNCTIONS
printData("\n⚖️ Generic Comparison Functions:");

// In TypeScript: function areEqual<T>(a: T, b: T): boolean
function areEqual(a, b) {
  return a === b;
}

// In TypeScript: function getMax<T>(a: T, b: T): T (assuming T can be compared)
function getMax(a, b) {
  return a > b ? a : b;
}

printData("Are 5 and 5 equal? " + areEqual(5, 5));
printData("Are 'cat' and 'dog' equal? " + areEqual('cat', 'dog'));
printData("Max of 10 and 7: " + getMax(10, 7));
printData("Max of 'apple' and 'banana': " + getMax('apple', 'banana'));

// GENERIC BENEFITS
printData("\n🌟 Generic Benefits:");
printData("✅ Flexible - Works with any type");
printData("✅ Safe - TypeScript ensures type consistency");
printData("✅ Reusable - Write once, use with many types");
printData("✅ Clear - Shows exactly what types are expected");

// WHAT TYPESCRIPT WOULD CATCH
printData("\n🚫 What TypeScript Would Catch:");
printData("✅ getFirst([1, 2, 3]) returns number");
printData("✅ getFirst(['a', 'b', 'c']) returns string");
printData("❌ Mixing types: getFirst([1, 'a']) would be caught");
printData("❌ Wrong return type usage would be caught");

printData("\n🎯 Generics make your code flexible and type-safe!");
```