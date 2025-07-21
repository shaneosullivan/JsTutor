---
id: "basic-types-teaching-javascript-about-different-kinds-of-data"
courseId: "typescript"
title: "Basic Types - Teaching JavaScript About Different Kinds of Data"
description: "Learn about TypeScript's basic types - number, string, boolean, and more!"
expectedOutput: "Examples of different TypeScript types and how to use them"
order: 2
version: 1
---

## What are Types?

Types are like **labels** that tell TypeScript what kind of data you're working with. It's like putting stickers on boxes to know what's inside!

### 🏷️ The Basic Types:

**Number** 🔢 - Any number (whole or decimal)
```typescript
let age: number = 9;
let price: number = 12.99;
```

**String** 📝 - Text (words, sentences, letters)
```typescript
let name: string = "Alice";
let message: string = "Hello, world!";
```

**Boolean** ✅❌ - True or false
```typescript
let isHappy: boolean = true;
let isRaining: boolean = false;
```

**Array** 📋 - A list of things
```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
```

### 🤔 Why Are Types Important?

Types help TypeScript understand:
- What you can do with your data
- What functions you can call
- What will happen when you combine things

### 📝 Type Annotations:

You add types using a **colon** `:` after the variable name:
```typescript
let variableName: type = value;
```

### 🎯 TypeScript is Smart!

Sometimes TypeScript can **figure out** the type by itself:
```typescript
let smartAge = 9;        // TypeScript knows this is a number!
let smartName = "Alice";  // TypeScript knows this is a string!
```

This is called **Type Inference** - TypeScript is being smart for you!

### 🚀 Your Mission:

Learn to use basic types to make your variables super clear!