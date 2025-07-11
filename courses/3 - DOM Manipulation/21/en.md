---
id: 21
courseId: 3
title: "Finding Elements"
description: "Learn to find and select HTML elements"
expectedOutput: "A webpage with modified elements"
order: 2
version: 1
---

## Finding Elements

The **DOM** (Document Object Model) is like a map of your webpage. You can find any element and change it!

### 🔍 What You'll Learn:

- How to find elements by ID, class, and tag
- The difference between `querySelector` and `querySelectorAll`
- How to check if elements exist

### Finding Elements:

```javascript
// By ID
document.getElementById('myId');

// By class (first match)
document.querySelector('.myClass');

// By tag (all matches)
document.querySelectorAll('p');
```

### 🌟 Your Challenge:

Try finding different elements and changing their text!