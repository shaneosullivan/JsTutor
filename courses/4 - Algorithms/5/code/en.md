---
version: 1
---

```javascript
// Problem: Find all anagrams of a word
// An anagram is a word made by rearranging letters of another word

// Step 1: Generate all permutations of a word
function getPermutations(str) {
  if (str.length <= 1) {
    return [str];
  }

  let permutations = [];
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let remainingChars = str.slice(0, i) + str.slice(i + 1);
    let remainingPermutations = getPermutations(remainingChars);

    for (let perm of remainingPermutations) {
      permutations.push(char + perm);
    }
  }

  return permutations;
}

// Step 2: Check if permutations are real words
function findAnagrams(word, dictionary) {
  let permutations = getPermutations(word.toLowerCase());
  let anagrams = [];

  for (let perm of permutations) {
    if (dictionary.includes(perm) && perm !== word.toLowerCase()) {
      anagrams.push(perm);
    }
  }

  return [...new Set(anagrams)]; // Remove duplicates
}

// Test our anagram finder
let testWord = "cat";
let simpleDictionary = ["act", "tac", "bat", "tab", "cat", "dog"];

printData(`Finding anagrams of "${testWord}":`);
printData("All permutations:");
printData(getPermutations(testWord));

printData("Valid anagrams:");
printData(findAnagrams(testWord, simpleDictionary));

printData("---");

// Problem: Find the shortest path in a simple grid
function findShortestPath(grid, start, end) {
  let queue = [{ pos: start, path: [start] }];
  let visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  let directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // right, down, left, up

  while (queue.length > 0) {
    let { pos, path } = queue.shift();
    let [x, y] = pos;

    if (x === end[0] && y === end[1]) {
      return path;
    }

    for (let [dx, dy] of directions) {
      let newX = x + dx;
      let newY = y + dy;
      let newPos = [newX, newY];
      let posKey = `${newX},${newY}`;

      if (
        newX >= 0 &&
        newX < grid.length &&
        newY >= 0 &&
        newY < grid[0].length &&
        grid[newX][newY] === 0 &&
        !visited.has(posKey)
      ) {
        visited.add(posKey);
        queue.push({ pos: newPos, path: [...path, newPos] });
      }
    }
  }

  return null; // No path found
}

// Test pathfinding
let grid = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
];

printData("Grid (0 = walkable, 1 = wall):");
printData(grid);

let path = findShortestPath(grid, [0, 0], [3, 3]);
printData("Shortest path from [0,0] to [3,3]:");
printData(path);
```
