---
id: "union-types-when-something-can-be-multiple-types"
courseId: "typescript"
title: "Union Types - When Something Can Be Multiple Types"
description: "Learn about union types - when a variable can be more than one type!"
expectedOutput: "Examples of union types and how to work with them safely"
order: 6
version: 1
---

## What are Union Types?

Union types let you say "this can be **either** this type **or** that type". It's like saying "I want either pizza or burgers" - you're happy with either option!

### 🤔 Why Do We Need Union Types?

Sometimes data can be different types:
- A user ID might be a number OR a string
- A response might be data OR an error message
- A function might return success OR failure

### 🎯 Union Type Syntax:

```typescript
let id: number | string;  // Can be number OR string
id = 123;        // ✅ Valid
id = "abc123";   // ✅ Also valid
```

### 📝 Common Union Type Examples:

**Multiple primitive types:**
```typescript
let status: "loading" | "success" | "error";
```

**Null or undefined:**
```typescript
let data: string | null;
```

**Different object types:**
```typescript
let response: SuccessResponse | ErrorResponse;
```

### 🔍 Type Guards:

When using union types, you need to **check** which type you have:
```typescript
if (typeof id === "number") {
  // Now TypeScript knows id is a number
}
```

### 🚀 Your Mission:

Learn to handle variables that can be multiple types safely!