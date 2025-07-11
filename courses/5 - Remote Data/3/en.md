---
id: 3
courseId: 5
title: "POST Requests"
description: "Learn to send data to servers"
expectedOutput: "Various POST requests sending data to the server"
order: 3
version: 1
---

## POST Requests

**POST requests** let us send information to servers, like filling out a form!

### 🔍 What You'll Learn:

- How to send data with POST requests
- Different data formats (JSON, form data)
- Handling server responses

### POST Request Examples:

```javascript
// Sending JSON data
fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 🌟 Your Challenge:

Try creating different types of data and sending them to the server!