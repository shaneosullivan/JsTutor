---
version: 1
---

```javascript
// Interfaces in TypeScript!

printData("=== Learning About Interfaces ===");

// BASIC INTERFACES
printData("📋 Basic Interfaces:");

// In TypeScript: interface Person { name: string; age: number; grade: number; }
// Then: let student1: Person = { ... }
let student1 = { name: "Alice", age: 9, grade: 4 };
let student2 = { name: "Bob", age: 10, grade: 5 };
let student3 = { name: "Charlie", age: 9, grade: 4 };

printData("Student 1: " + student1.name + ", age " + student1.age + ", grade " + student1.grade);
printData("Student 2: " + student2.name + ", age " + student2.age + ", grade " + student2.grade);
printData("Student 3: " + student3.name + ", age " + student3.age + ", grade " + student3.grade);

// INTERFACES WITH METHODS
printData("\n🔧 Interfaces with Methods:");

// In TypeScript: interface Calculator { add(a: number, b: number): number; subtract(a: number, b: number): number; }
let myCalculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  }
};

let yourCalculator = {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  }
};

printData("My calculator: 5 + 3 = " + myCalculator.add(5, 3));
printData("Your calculator: 10 - 4 = " + yourCalculator.subtract(10, 4));

// OPTIONAL PROPERTIES
printData("\n❓ Optional Properties:");

// In TypeScript: interface Pet { name: string; species: string; age?: number; isVaccinated?: boolean; }
let pet1 = { name: "Fluffy", species: "cat", age: 3, isVaccinated: true };
let pet2 = { name: "Buddy", species: "dog", age: 5 };
let pet3 = { name: "Goldie", species: "fish" }; // age and isVaccinated are optional

function describePet(pet) {
  let description = pet.name + " is a " + pet.species;
  if (pet.age) {
    description += ", age " + pet.age;
  }
  if (pet.isVaccinated) {
    description += ", vaccinated";
  }
  return description;
}

printData("Pet 1: " + describePet(pet1));
printData("Pet 2: " + describePet(pet2));
printData("Pet 3: " + describePet(pet3));

// INTERFACE INHERITANCE
printData("\n🧬 Interface Inheritance:");

// In TypeScript: interface Animal { name: string; species: string; }
// interface Dog extends Animal { breed: string; isGoodBoy: boolean; }
let dog1 = { name: "Max", species: "dog", breed: "Golden Retriever", isGoodBoy: true };
let dog2 = { name: "Bella", species: "dog", breed: "Labrador", isGoodBoy: true };

printData("Dog 1: " + dog1.name + " is a " + dog1.breed + " (good boy: " + dog1.isGoodBoy + ")");
printData("Dog 2: " + dog2.name + " is a " + dog2.breed + " (good boy: " + dog2.isGoodBoy + ")");

// FUNCTIONS USING INTERFACES
printData("\n🔧 Functions Using Interfaces:");

// In TypeScript: function createGreeting(person: Person): string
function createGreeting(person) {
  return "Hello, " + person.name + "! You are " + person.age + " years old.";
}

// In TypeScript: function calculateGrade(student: Student): string
function calculateGrade(student) {
  if (student.grade >= 5) {
    return student.name + " is in upper elementary!";
  } else {
    return student.name + " is in lower elementary!";
  }
}

printData("Greeting: " + createGreeting(student1));
printData("Grade info: " + calculateGrade(student2));

// ARRAY OF INTERFACE OBJECTS
printData("\n📋 Arrays of Interface Objects:");

// In TypeScript: let books: Book[] = [...]
let books = [
  { title: "The Magic Tree", author: "Jane Writer", pages: 150, isAvailable: true },
  { title: "Space Adventure", author: "Bob Author", pages: 200, isAvailable: false },
  { title: "Ocean Mystery", author: "Sue Storyteller", pages: 180, isAvailable: true }
];

printData("Available books:");
for (let book of books) {
  if (book.isAvailable) {
    printData("  📖 " + book.title + " by " + book.author + " (" + book.pages + " pages)");
  }
}

// INTERFACE BENEFITS
printData("\n🌟 Interface Benefits:");
printData("✅ Reusable - Write the blueprint once, use everywhere");
printData("✅ Consistent - All objects follow the same pattern");
printData("✅ Clear - Interface names explain what objects represent");
printData("✅ Safe - TypeScript ensures objects match the interface");

// WHAT TYPESCRIPT WOULD CATCH
printData("\n🚫 What TypeScript Would Catch:");
printData("✅ { name: 'Alice', age: 9 } matches Person interface");
printData("❌ { name: 'Alice' } - TypeScript: 'Missing age property!'");
printData("❌ { name: 'Alice', age: 'nine' } - TypeScript: 'Age must be number!'");
printData("❌ { firstName: 'Alice', age: 9 } - TypeScript: 'Need name, not firstName!'");

printData("\n🎯 Interfaces make your code organized and reusable!");
```