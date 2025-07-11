---
id: 2
courseId: 5
title: "GET Requests"
description: "Learn to retrieve data from servers"
expectedOutput: "Various GET requests with different responses and error handling"
order: 2
version: 1
---

## GET Requests

**GET requests** are how we ask servers for information, like asking a librarian for a book!

### 🔍 What You'll Learn:

- How to make GET requests
- How to handle different response formats
- Error handling for network requests

### GET Request Examples:

```javascript
// Basic GET request
fetch('/api/users')
    .then(response => response.json())
    .then(users => console.log(users));

// GET with parameters
fetch('/api/users?page=1&limit=10')
    .then(response => response.json())
    .then(data => console.log(data));
```

### 🌟 Your Challenge:

Try fetching different types of data and see how the format changes!