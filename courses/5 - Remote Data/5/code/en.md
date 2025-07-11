---
version: 1
---

```javascript
// A complete todo list application using remote data

class TodoApp {
  constructor() {
    this.todos = [];
    this.init();
  }

  async init() {
    printData("Starting Todo App...");
    await this.loadTodos();
    this.displayTodos();
  }

  async loadTodos() {
    try {
      printData("Loading todos from server...");

      let response = await fetch("/api/test-data/todos");

      if (response.ok) {
        this.todos = await response.json();
        printData(`Loaded ${this.todos.length} todos`);
      } else {
        printData("Failed to load todos, using empty list");
        this.todos = [];
      }
    } catch (error) {
      printData("Error loading todos:", error.message);
      this.todos = [];
    }
  }

  async addTodo(text) {
    try {
      printData(`Adding todo: "${text}"`);

      let response = await fetch("/api/test-data/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          completed: false,
        }),
      });

      if (response.ok) {
        let newTodo = await response.json();
        this.todos.push(newTodo);
        printData("Todo added successfully");
        this.displayTodos();
      } else {
        printData("Failed to add todo");
      }
    } catch (error) {
      printData("Error adding todo:", error.message);
    }
  }

  async toggleTodo(id) {
    try {
      let todo = this.todos.find((t) => t.id === id);
      if (!todo) return;

      printData(`Toggling todo: "${todo.text}"`);

      let response = await fetch(`/api/test-data/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (response.ok) {
        todo.completed = !todo.completed;
        printData("Todo updated successfully");
        this.displayTodos();
      } else {
        printData("Failed to update todo");
      }
    } catch (error) {
      printData("Error updating todo:", error.message);
    }
  }

  displayTodos() {
    printData("=== Current Todos ===");

    if (this.todos.length === 0) {
      printData("No todos yet! Add some tasks.");
      return;
    }

    this.todos.forEach((todo, index) => {
      let status = todo.completed ? "✓" : "○";
      printData(`${index + 1}. ${status} ${todo.text}`);
    });

    let completed = this.todos.filter((t) => t.completed).length;
    printData(`${completed} of ${this.todos.length} completed`);
  }

  getStats() {
    let total = this.todos.length;
    let completed = this.todos.filter((t) => t.completed).length;
    let remaining = total - completed;

    return {
      total,
      completed,
      remaining,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}

// Create and use the todo app
let app = new TodoApp();

// Simulate user interactions
setTimeout(() => {
  app.addTodo("Learn about APIs");
}, 1000);

setTimeout(() => {
  app.addTodo("Build a todo app");
}, 2000);

setTimeout(() => {
  app.addTodo("Deploy to production");
}, 3000);

setTimeout(() => {
  // Mark first todo as completed
  if (app.todos.length > 0) {
    app.toggleTodo(app.todos[0].id);
  }
}, 4000);

setTimeout(() => {
  printData("=== Final Stats ===");
  printData(app.getStats());
}, 5000);
```
