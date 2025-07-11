---
version: 1
---

```javascript
// Linear Search - Check each item one by one
function linearSearch(array, target) {
  let steps = 0;
  for (let i = 0; i < array.length; i++) {
    steps++;
    if (array[i] === target) {
      return { found: true, index: i, steps: steps };
    }
  }
  return { found: false, index: -1, steps: steps };
}

// Binary Search - For sorted arrays only!
function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;
  let steps = 0;

  while (left <= right) {
    steps++;
    let middle = Math.floor((left + right) / 2);

    if (array[middle] === target) {
      return { found: true, index: middle, steps: steps };
    } else if (array[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return { found: false, index: -1, steps: steps };
}

// Test both algorithms
let numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let target = 13;

printData("Searching for:", target);
printData("In array:", numbers);

let linearResult = linearSearch(numbers, target);
printData("Linear search result:");
printData(linearResult);

let binaryResult = binarySearch(numbers, target);
printData("Binary search result:");
printData(binaryResult);

printData(
  `Binary search was ${linearResult.steps - binaryResult.steps} steps faster!`
);
```
