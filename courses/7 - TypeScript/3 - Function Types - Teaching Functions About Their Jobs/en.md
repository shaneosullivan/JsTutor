---
id: "function-types-teaching-functions-about-their-jobs"
courseId: "typescript"
title: "Function Types - Teaching Functions About Their Jobs"
description: "Learn how to add types to functions so they know exactly what to expect!"
expectedOutput: "Examples of functions with parameter types and return types"
order: 3
version: 1
---

## What are Function Types?

Function types tell TypeScript **exactly** what a function should receive and what it should give back. It's like giving a function a **job description**!

### 🎯 Function Type Parts:

**Parameter Types** - What the function needs:
```typescript
function greet(name: string) {
  // name must be a string
}
```

**Return Type** - What the function gives back:
```typescript
function add(a: number, b: number): number {
  return a + b; // Must return a number
}
```

### 🤔 Why Are Function Types Important?

1. **Clear expectations** - Everyone knows what the function needs
2. **Catch mistakes** - TypeScript stops you from passing wrong data
3. **Better help** - Your editor knows what the function does
4. **Documentation** - The function explains itself!

### 📝 Function Type Syntax:

```typescript
function functionName(param1: type1, param2: type2): returnType {
  // function body
  return something;
}
```

### ✨ Optional Parameters:

Sometimes functions don't need all their parameters:
```typescript
function greet(name: string, greeting?: string) {
  // greeting is optional (notice the ?)
}
```

### 🚀 Your Mission:

Learn to give functions clear instructions about what they should do!