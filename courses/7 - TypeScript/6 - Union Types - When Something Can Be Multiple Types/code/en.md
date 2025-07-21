---
version: 1
---

```javascript
// Union Types in TypeScript!

printData("=== Learning About Union Types ===");

// BASIC UNION TYPES
printData("🔄 Basic Union Types:");

// In TypeScript: let id: number | string;
let userId = 123;        // Can be a number
let productId = "abc123"; // Can be a string

printData("User ID (number): " + userId);
printData("Product ID (string): " + productId);

// LITERAL UNION TYPES
printData("\n📝 Literal Union Types:");

// In TypeScript: let status: "loading" | "success" | "error";
let currentStatus = "loading";
printData("Current status: " + currentStatus);

currentStatus = "success";
printData("Updated status: " + currentStatus);

// In TypeScript: let size: "small" | "medium" | "large";
let shirtSize = "medium";
printData("Shirt size: " + shirtSize);

// UNION WITH NULL/UNDEFINED
printData("\n❓ Union with Null/Undefined:");

// In TypeScript: let userName: string | null;
let userName = "Alice";
printData("User name: " + userName);

userName = null; // Sometimes we don't have a name
printData("User name (null): " + userName);

// TYPE GUARDS - checking which type we have
printData("\n🔍 Type Guards:");

function processId(id) {
  // In TypeScript: function processId(id: number | string): string
  if (typeof id === "number") {
    // TypeScript knows id is a number here
    return "Number ID: " + (id * 2);
  } else {
    // TypeScript knows id is a string here
    return "String ID: " + id.toUpperCase();
  }
}

printData("Process number ID: " + processId(123));
printData("Process string ID: " + processId("abc"));

// UNION TYPES WITH OBJECTS
printData("\n📦 Union Types with Objects:");

// In TypeScript: let response: { success: true; data: string } | { success: false; error: string };
let successResponse = { success: true, data: "Everything worked!" };
let errorResponse = { success: false, error: "Something went wrong!" };

function handleResponse(response) {
  if (response.success) {
    printData("✅ Success: " + response.data);
  } else {
    printData("❌ Error: " + response.error);
  }
}

handleResponse(successResponse);
handleResponse(errorResponse);

// ARRAY UNION TYPES
printData("\n📋 Array Union Types:");

// In TypeScript: let mixedArray: (number | string)[];
let mixedArray = [1, "hello", 2, "world", 3];

printData("Mixed array contents:");
for (let item of mixedArray) {
  if (typeof item === "number") {
    printData("  Number: " + item);
  } else {
    printData("  String: " + item);
  }
}

// FUNCTION PARAMETER UNION TYPES
printData("\n🔧 Function Parameter Union Types:");

// In TypeScript: function formatValue(value: number | string): string
function formatValue(value) {
  if (typeof value === "number") {
    return "Number: " + value.toFixed(2);
  } else {
    return "Text: " + value.toUpperCase();
  }
}

printData("Format number: " + formatValue(123.456));
printData("Format string: " + formatValue("hello world"));

// UNION WITH ARRAYS
printData("\n📊 Union with Arrays:");

// In TypeScript: let data: number[] | string;
let numberData = [1, 2, 3, 4, 5];
let stringData = "No data available";

function processData(data) {
  if (Array.isArray(data)) {
    printData("Array data: " + data.join(", "));
  } else {
    printData("String data: " + data);
  }
}

processData(numberData);
processData(stringData);

// DISCRIMINATED UNIONS
printData("\n🎯 Discriminated Unions:");

// In TypeScript: type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };
let circle = { kind: "circle", radius: 5 };
let square = { kind: "square", size: 4 };

function calculateArea(shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.size * shape.size;
  }
}

printData("Circle area: " + calculateArea(circle).toFixed(2));
printData("Square area: " + calculateArea(square));

// UNION TYPE BENEFITS
printData("\n🌟 Union Type Benefits:");
printData("✅ Flexible - Handle different types of data");
printData("✅ Safe - TypeScript checks which type you have");
printData("✅ Clear - Shows exactly what types are allowed");
printData("✅ Powerful - Can represent complex data scenarios");

// WHAT TYPESCRIPT WOULD CATCH
printData("\n🚫 What TypeScript Would Catch:");
printData("✅ id = 123 (number) - Good!");
printData("✅ id = 'abc' (string) - Good!");
printData("❌ id = true (boolean) - TypeScript: 'Not allowed!'");
printData("❌ status = 'unknown' - TypeScript: 'Not in the union!'");

printData("\n🎯 Union types make your code flexible and safe!");
```