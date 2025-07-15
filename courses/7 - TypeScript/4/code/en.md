---
version: 1
---

```javascript
// Object Types in TypeScript!

printData("=== Learning Object Types ===");

// BASIC OBJECT TYPES
printData("🧑 Basic Object Types:");

// In TypeScript: let person: { name: string; age: number; isStudent: boolean; }
let person = {
  name: "Alice",
  age: 9,
  isStudent: true
};

printData("Person: " + person.name + ", age " + person.age + ", student: " + person.isStudent);

// OBJECT WITH METHODS
printData("\n🔧 Objects with Methods:");

// In TypeScript: let calculator: { add: (a: number, b: number) => number; multiply: (a: number, b: number) => number; }
let calculator = {
  add: function(a, b) {
    return a + b;
  },
  multiply: function(a, b) {
    return a * b;
  }
};

printData("calculator.add(5, 3): " + calculator.add(5, 3));
printData("calculator.multiply(4, 6): " + calculator.multiply(4, 6));

// NESTED OBJECTS
printData("\n🏠 Nested Objects:");

// In TypeScript: let student: { name: string; grade: number; address: { street: string; city: string; }; }
let student = {
  name: "Bob",
  grade: 4,
  address: {
    street: "123 Main St",
    city: "Friendlyville"
  }
};

printData("Student: " + student.name + " in grade " + student.grade);
printData("Address: " + student.address.street + ", " + student.address.city);

// ARRAY OF OBJECTS
printData("\n📋 Array of Objects:");

// In TypeScript: let pets: { name: string; type: string; age: number; }[]
let pets = [
  { name: "Fluffy", type: "cat", age: 3 },
  { name: "Buddy", type: "dog", age: 5 },
  { name: "Goldie", type: "fish", age: 1 }
];

printData("Pets:");
for (let pet of pets) {
  printData("  " + pet.name + " is a " + pet.age + " year old " + pet.type);
}

// OPTIONAL PROPERTIES
printData("\n❓ Optional Properties:");

// In TypeScript: let book: { title: string; author: string; pages?: number; }
let book1 = {
  title: "The Magic Adventure",
  author: "Jane Writer",
  pages: 200
};

let book2 = {
  title: "Short Story",
  author: "Bob Author"
  // pages is optional, so we can skip it
};

printData("Book 1: " + book1.title + " by " + book1.author + " (" + book1.pages + " pages)");
printData("Book 2: " + book2.title + " by " + book2.author + " (pages unknown)");

// FUNCTIONS THAT TAKE OBJECTS
printData("\n🔧 Functions with Object Parameters:");

// In TypeScript: function describePet(pet: { name: string; type: string; age: number; }): string
function describePet(pet) {
  return pet.name + " is a " + pet.age + " year old " + pet.type;
}

// In TypeScript: function calculateArea(rectangle: { width: number; height: number; }): number
function calculateArea(rectangle) {
  return rectangle.width * rectangle.height;
}

let myPet = { name: "Whiskers", type: "cat", age: 2 };
let myRectangle = { width: 5, height: 3 };

printData("describePet: " + describePet(myPet));
printData("calculateArea: " + calculateArea(myRectangle));

// OBJECT TYPE CHECKING
printData("\n🔍 Object Type Checking:");

function greetUser(user) {
  // In TypeScript: function greetUser(user: { name: string; age: number; }): string
  return "Hello, " + user.name + "! You are " + user.age + " years old.";
}

let validUser = { name: "Charlie", age: 10 };
printData("Valid user: " + greetUser(validUser));

// WHAT TYPESCRIPT WOULD CATCH
printData("\n🚫 What TypeScript Would Catch:");
printData("✅ { name: 'Alice', age: 9 } - Perfect!");
printData("❌ { name: 'Alice' } - TypeScript: 'Where is age?'");
printData("❌ { name: 'Alice', age: 'nine' } - TypeScript: 'Age must be a number!'");
printData("❌ { firstName: 'Alice', age: 9 } - TypeScript: 'I need name, not firstName!'");

// READONLY PROPERTIES (Advanced)
printData("\n🔒 Readonly Properties:");

// In TypeScript: let config: { readonly apiUrl: string; readonly timeout: number; }
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

printData("Config: " + config.apiUrl + " (timeout: " + config.timeout + "ms)");
printData("❌ TypeScript would prevent changing readonly properties!");

printData("\n🎯 Object types make your data structure super clear!");
```