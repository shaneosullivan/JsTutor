---
version: 1
---

```javascript
// Let's see the difference between var, let, and const!

// OLD WAY - using var (can cause problems)
var oldName = "Bobby";
printData("Old way with var: " + oldName);

// NEW WAY - using let (better and safer)
let newName = "Sarah";
printData("New way with let: " + newName);

// We can change let variables
newName = "Emma";
printData("Changed let variable: " + newName);

// NEWEST WAY - using const (cannot be changed)
const favoritePet = "Cat";
printData("Const variable: " + favoritePet);

// Try uncommenting this line - it will cause an error!
// favoritePet = "Dog"; // This won't work!

// Let's see how let and const work in blocks
if (true) {
  let blockVariable = "I only exist in this block!";
  const blockConstant = "I'm also only in this block!";
  
  printData("Inside block: " + blockVariable);
  printData("Inside block: " + blockConstant);
}

// Try uncommenting these - they won't work!
// printData("Outside block: " + blockVariable); // Error!
// printData("Outside block: " + blockConstant); // Error!

printData("✅ Let and const keep things organized!");
```