---
id: 1
courseId: 5
title: "What is Remote Data?"
description: "Learn about APIs and fetching data from servers"
expectedOutput: "Data fetched from remote APIs displayed"
order: 1
version: 1
---

## What is Remote Data?

**Remote data** means getting information from other computers on the internet!

### 🔍 What You'll Learn:

- What **APIs** are
- How data travels over the internet
- Why we need remote data

### API Basics:

```javascript
// Making an API request
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
```

### Key Concepts:

- **API**: Application Programming Interface
- **HTTP**: How computers talk to each other
- **JSON**: Format for sending data

### 🌟 Your Challenge:

Try making your first API request and see what data you get back!