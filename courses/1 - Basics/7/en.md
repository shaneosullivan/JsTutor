---
id: 7
courseId: 1
title: "Listening to Keys"
description: "Make your program respond to keyboard input"
expectedOutput: "A blue circle that moves with arrow keys and turns red with spacebar"
order: 7
version: 1
---

## Listening to Keys

Learn to make your programs **interactive**! You can make things happen when keys are pressed.

### 🎮 New Functions:

- `onKeyPress(callback)` - Runs your code when **ANY** key is pressed
- `onArrowKeys(callback)` - Runs your code when **arrow keys** are pressed
- `onSpaceBar(callback)` - Runs your code when **spacebar** is pressed
- `isKeyPressed(key)` - Checks if a specific key is currently being held down

### How It Works:

```javascript
onArrowKeys((direction) => {
    if (direction === 'up') {
        // do something when up arrow pressed
    }
});
```

### 🌟 Your Challenge:

Try adding your own key controls! Can you make different shapes appear when different keys are pressed?