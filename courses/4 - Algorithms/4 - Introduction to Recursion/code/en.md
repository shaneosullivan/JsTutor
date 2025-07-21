---
version: 1
---

```javascript
// Recursive function to calculate factorial
// 5! = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
  printData(`Calculating factorial of ${n}`);

  // Base case - when to stop
  if (n === 0 || n === 1) {
    printData(`Base case: ${n}! = 1`);
    return 1;
  }

  // Recursive case - function calls itself
  let result = n * factorial(n - 1);
  printData(`${n}! = ${n} × ${n - 1}! = ${result}`);
  return result;
}

// Test factorial
printData("Computing 5!:");
let fact5 = factorial(5);
printData("Final result:", fact5);

printData("---");

// Recursive function to sum numbers from 1 to n
function sumUpTo(n) {
  if (n === 1) {
    printData("Base case: sum up to 1 = 1");
    return 1;
  }

  let result = n + sumUpTo(n - 1);
  printData(`Sum up to ${n} = ${n} + sum up to ${n - 1} = ${result}`);
  return result;
}

printData("Computing sum from 1 to 5:");
let sum = sumUpTo(5);
printData("Final sum:", sum);

printData("---");

// Fibonacci sequence using recursion
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

printData("First 10 Fibonacci numbers:");
for (let i = 0; i < 10; i++) {
  printData(`F(${i}) = ${fibonacci(i)}`);
}
```
