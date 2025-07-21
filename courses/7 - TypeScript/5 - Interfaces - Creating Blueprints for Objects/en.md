---
id: "interfaces-creating-blueprints-for-objects"
courseId: "typescript"
title: "Interfaces - Creating Blueprints for Objects"
description: "Learn about interfaces - reusable blueprints that describe what objects should look like!"
expectedOutput: "Examples of interfaces and how they make object types reusable"
order: 5
version: 1
---

## What are Interfaces?

Interfaces are like **blueprints** or **templates** for objects! Instead of writing the same object type over and over, you create an interface once and use it everywhere.

### 🤔 Why Are Interfaces Better?

**Without interfaces** (repeating yourself):
```typescript
let person1: { name: string; age: number; } = { name: "Alice", age: 9 };
let person2: { name: string; age: number; } = { name: "Bob", age: 10 };
```

**With interfaces** (much cleaner):
```typescript
interface Person {
  name: string;
  age: number;
}

let person1: Person = { name: "Alice", age: 9 };
let person2: Person = { name: "Bob", age: 10 };
```

### 🎯 Interface Benefits:

1. **Reusable** - Write once, use everywhere
2. **Consistent** - All objects follow the same pattern
3. **Readable** - Clear names make code easier to understand
4. **Maintainable** - Change the interface, update everywhere

### 📝 Interface Features:

**Basic Interface:**
```typescript
interface Animal {
  name: string;
  species: string;
}
```

**Optional Properties:**
```typescript
interface Pet {
  name: string;
  age?: number;  // Optional!
}
```

**Method Properties:**
```typescript
interface Calculator {
  add(a: number, b: number): number;
}
```

### 🚀 Your Mission:

Learn to create reusable blueprints for your objects!