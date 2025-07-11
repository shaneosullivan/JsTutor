---
id: 12
courseId: 1
title: "Spacebar Magic"
description: "Add special actions with the spacebar"
expectedOutput: "Move with arrows, press spacebar to create colorful circles"
order: 12
version: 1
---

## Spacebar Magic

The **spacebar** is perfect for special actions! In games, it's often used for jumping, shooting, or resetting things.

### 🚀 Spacebar Power:

- `onSpaceBar()` listens specifically for the spacebar
- Great for **'action'** buttons in games
- Can trigger special effects or reset your game
- Works great with other keyboard controls

### How to Use:

```javascript
onSpaceBar(() => {
    // This runs when spacebar is pressed
    drawCircle(playerX, playerY, 30, 'gold');
});
```

### ✨ Action Ideas:

- Jump or change color
- Create new objects
- Reset positions
- Trigger animations

### 🌟 Your Challenge:

Try combining arrow keys **AND** spacebar! Maybe the spacebar changes the player's color, or creates a trail behind them?