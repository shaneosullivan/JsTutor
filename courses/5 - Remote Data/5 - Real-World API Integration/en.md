---
id: "realworld-api-integration"
courseId: "remote-data"
title: "Real-World API Integration"
description: "Put it all together with a complete example"
expectedOutput: "A complete todo application with remote data integration"
order: 5
version: 1
---

## Real-World API Integration

Let's build a **complete application** that uses everything we've learned!

### 🔍 What You'll Learn:

- Combining GET and POST requests
- Managing application state
- Creating a real user interface

### Complete Example:

```javascript
class TodoApp {
    constructor() {
        this.todos = [];
        this.loadTodos();
    }
    
    async loadTodos() {
        const response = await fetch('/api/todos');
        this.todos = await response.json();
        this.render();
    }
    
    async addTodo(text) {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        this.todos.push(newTodo);
        this.render();
    }
}
```

### 🌟 Your Challenge:

Try extending this example with more features!