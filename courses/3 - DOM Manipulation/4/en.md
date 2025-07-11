---
id: 4
courseId: 3
title: "Creating New Elements"
description: "Add new HTML elements with JavaScript"
expectedOutput: "A webpage where you can create and remove elements"
order: 4
version: 1
---

## Creating New Elements

You can create **brand new HTML elements** and add them to your page!

### 🔍 What You'll Learn:

- How to create new elements
- How to add them to the page
- How to remove elements

### Creating Elements:

```javascript
// Create a new element
let newDiv = document.createElement('div');
newDiv.textContent = 'Hello World!';

// Add to page
document.body.appendChild(newDiv);

// Remove from page
newDiv.remove();
```

### 🌟 Your Challenge:

Try creating different types of elements and adding them in different places!