---
version: 1
---

```javascript
// Basic Types in TypeScript!

printData("=== Learning TypeScript Basic Types ===");

// NUMBER TYPE 🔢
printData("🔢 Number Types:");
// In TypeScript: let age: number = 9;
let age = 9;                    // TypeScript knows this is a number
let height = 4.5;               // Decimal numbers work too
let temperature = -5;           // Negative numbers work too

printData("Age: " + age + " (type: number)");
printData("Height: " + height + " feet (type: number)");
printData("Temperature: " + temperature + "°C (type: number)");

// STRING TYPE 📝
printData("\n📝 String Types:");
// In TypeScript: let name: string = "Alice";
let userName = "Alice";
let favoritePet = "Cat";
let message = `Hello, ${userName}! You love your ${favoritePet}!`;

printData("Name: " + userName + " (type: string)");
printData("Pet: " + favoritePet + " (type: string)");
printData("Message: " + message + " (type: string)");

// BOOLEAN TYPE ✅❌
printData("\n✅ Boolean Types:");
// In TypeScript: let isHappy: boolean = true;
let isHappy = true;
let isRaining = false;
let likesChocolate = true;

printData("Is happy: " + isHappy + " (type: boolean)");
printData("Is raining: " + isRaining + " (type: boolean)");
printData("Likes chocolate: " + likesChocolate + " (type: boolean)");

// ARRAY TYPES 📋
printData("\n📋 Array Types:");
// In TypeScript: let numbers: number[] = [1, 2, 3];
let favoriteNumbers = [7, 13, 21];
let friendNames = ["Bob", "Charlie", "Diana"];
let testScores = [95, 87, 92, 88];

printData("Favorite numbers: " + favoriteNumbers + " (type: number[])");
printData("Friend names: " + friendNames + " (type: string[])");
printData("Test scores: " + testScores + " (type: number[])");

// MIXED EXAMPLES - showing what would work and what wouldn't
printData("\n🎯 Type Safety Examples:");
printData("✅ This works: age + 1 = " + (age + 1));
printData("✅ This works: userName.length = " + userName.length);
printData("✅ This works: favoriteNumbers[0] = " + favoriteNumbers[0]);

printData("\n❌ These would cause TypeScript errors:");
printData("❌ age + userName would be caught by TypeScript");
printData("❌ favoriteNumbers.push('hello') would be caught");
printData("❌ isHappy.toUpperCase() would be caught");

// FUNCTIONS WITH TYPES
printData("\n🔧 Functions with Types:");
// In TypeScript: function add(a: number, b: number): number { ... }
function addNumbers(a, b) {
  return a + b;
}

function greetPerson(name) {
  return "Hello, " + name + "!";
}

function checkAge(age) {
  return age >= 10;
}

printData("Add 5 + 3: " + addNumbers(5, 3));
printData("Greet Alice: " + greetPerson("Alice"));
printData("Is 9 >= 10? " + checkAge(9));

// TYPE INFERENCE - TypeScript figuring out types
printData("\n🧠 TypeScript is Smart (Type Inference):");
let autoNumber = 42;           // TypeScript: "This is a number!"
let autoString = "Hello";      // TypeScript: "This is a string!"
let autoBool = true;           // TypeScript: "This is a boolean!"

printData("Auto number: " + autoNumber + " (TypeScript knew it was a number!)");
printData("Auto string: " + autoString + " (TypeScript knew it was a string!)");
printData("Auto boolean: " + autoBool + " (TypeScript knew it was a boolean!)");

printData("\n🎉 Types make your code clear and safe!");
```