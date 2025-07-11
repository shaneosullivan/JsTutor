---
version: 1
---

```javascript
// Bubble Sort - Compare neighbors and swap if needed
function bubbleSort(array) {
  let arr = [...array]; // Make a copy
  let steps = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps++;
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return { sorted: arr, steps: steps };
}

// Selection Sort - Find the smallest and put it first
function selectionSort(array) {
  let arr = [...array]; // Make a copy
  let steps = 0;

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      steps++;
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap if needed
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }

  return { sorted: arr, steps: steps };
}

// Test both sorting algorithms
let unsortedNumbers = [64, 34, 25, 12, 22, 11, 90];
printData("Original array:");
printData(unsortedNumbers);

let bubbleResult = bubbleSort(unsortedNumbers);
printData("Bubble sort result:");
printData(bubbleResult);

let selectionResult = selectionSort(unsortedNumbers);
printData("Selection sort result:");
printData(selectionResult);

// Sort words alphabetically
let words = ["banana", "apple", "cherry", "date"];
printData("Sorting words:");
printData(words);
printData("Sorted words:");
printData(bubbleSort(words).sorted);
```
