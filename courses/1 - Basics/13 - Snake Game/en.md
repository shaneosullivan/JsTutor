---
id: "snake-game"
courseId: "basics"
title: "Snake Game"
description: "Build the classic Snake game"
expectedOutput: "A playable Snake game with arrow key controls"
order: 13
version: 1
---

## Snake Game

Let's build the famous **Snake game**! This combines everything we've learned: drawing, movement, keyboard controls, and game logic.

### 🐍 Snake Game Rules:

- Snake moves continuously in one direction
- Arrow keys change the direction
- Snake grows when it eats food
- Game ends if snake hits the walls or itself
- Score increases with each food eaten

### 🎮 Game Programming Concepts:

- **Game loop** (`setInterval`) keeps everything moving
- **Arrays** store the snake's body segments
- **Collision detection** checks for hits
- **Game state** manages score and game over

### Core Game Structure:

```javascript
let snake = [{x: 200, y: 200}];  // Snake body
let direction = 'right';         // Current direction
let food = {x: 160, y: 160};     // Food position
let gameOver = false;            // Game state
```

### 🌟 Your Challenge:

Try making the game your own! Change colors, speed, or add new features. What about power-ups or obstacles?