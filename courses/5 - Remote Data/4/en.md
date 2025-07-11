---
id: 4
courseId: 5
title: "Error Handling"
description: "Learn to handle different types of errors"
expectedOutput: "Different error scenarios and how to handle them"
order: 4
version: 1
---

## Error Handling

Sometimes things go wrong when talking to servers. Let's learn how to **handle errors gracefully**!

### 🔍 What You'll Learn:

- Different types of errors (network, server, client)
- **HTTP status codes**
- How to retry failed requests

### Error Handling Examples:

```javascript
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error:', error.message);
    });
```

### Common Status Codes:

- **200**: Success
- **404**: Not Found
- **500**: Server Error

### 🌟 Your Challenge:

Try making requests that will fail and see how to handle them!