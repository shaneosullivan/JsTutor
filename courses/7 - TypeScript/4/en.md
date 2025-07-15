---
id: 4
courseId: 7
title: "Object Types - Describing Things with Properties"
description: "Learn how to describe objects in TypeScript - things with properties and values!"
expectedOutput: "Examples of objects with typed properties and methods"
order: 4
version: 1
---

## What are Object Types?

Object types describe **things** that have **properties**. Like describing a person: they have a name, age, and favorite color!

### 🎯 Object Type Syntax:

```typescript
let person: {
  name: string;
  age: number;
  isHappy: boolean;
} = {
  name: "Alice",
  age: 9,
  isHappy: true
};
```

### 🤔 Why Are Object Types Useful?

1. **Clear structure** - Everyone knows what properties an object has
2. **Prevent mistakes** - TypeScript stops you from using wrong property names
3. **Better autocomplete** - Your editor knows what properties exist
4. **Documentation** - The object explains itself!

### 📝 Object Type Features:

**Required Properties** - Must be there:
```typescript
let dog: { name: string; age: number; }
```

**Optional Properties** - Might be there:
```typescript
let dog: { name: string; age?: number; }
```

**Method Properties** - Functions inside objects:
```typescript
let calculator: {
  add: (a: number, b: number) => number;
}
```

### 🚀 Your Mission:

Learn to describe objects so TypeScript knows exactly what they contain!