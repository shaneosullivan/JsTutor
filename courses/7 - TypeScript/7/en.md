---
id: 7
courseId: 7
title: "Generics - Creating Flexible, Reusable Code"
description: "Learn about generics - TypeScript's way to create flexible functions and classes!"
expectedOutput: "Examples of generic functions and interfaces that work with any type"
order: 7
version: 1
---

## What are Generics?

Generics let you create **flexible** functions and classes that work with **any type**! It's like having a **magic container** that can hold anything, but still knows what's inside.

### 🤔 Why Do We Need Generics?

Without generics, you'd have to write separate functions for different types:
```typescript
function getFirstNumber(items: number[]): number { ... }
function getFirstString(items: string[]): string { ... }
function getFirstBoolean(items: boolean[]): boolean { ... }
```

With generics, you write **one function** that works with **any type**:
```typescript
function getFirst<T>(items: T[]): T { ... }
```

### 🎯 Generic Syntax:

The `<T>` is like a **placeholder** for any type:
```typescript
function identity<T>(value: T): T {
  return value;
}
```

### 📝 How Generics Work:

1. **`<T>`** - This is a **type parameter** (like a variable for types)
2. **`T`** - Use this throughout your function to refer to the type
3. **TypeScript figures out** what `T` should be when you use the function

### 🚀 Your Mission:

Learn to create flexible functions that work with any type safely!