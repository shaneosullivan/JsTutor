---
version: 1
---

```javascript
// Different types of POST requests

// 1. Create a new user
async function createUser(userData) {
  try {
    printData("Creating new user...");
    printData("Data to send:", userData);

    let response = await fetch("/api/test-data/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      let newUser = await response.json();
      printData("User created successfully:");
      printData(newUser);
    } else {
      printData("Failed to create user:", response.status);
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// 2. Submit a form
async function submitContactForm(formData) {
  try {
    printData("Submitting contact form...");
    printData("Form data:", formData);

    let response = await fetch("/api/test-data/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      let result = await response.json();
      printData("Form submitted successfully:");
      printData(result);
    } else {
      printData("Form submission failed:", response.status);
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// 3. Upload some data
async function uploadData(data) {
  try {
    printData("Uploading data...");

    let response = await fetch("/api/test-data/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      let result = await response.json();
      printData("Data uploaded:");
      printData(result);
    } else {
      printData("Upload failed:", response.status);
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// Test POST requests
createUser({
  name: "Alice Johnson",
  email: "alice@example.com",
  age: 25,
});

submitContactForm({
  name: "Bob Smith",
  email: "bob@example.com",
  message: "Hello from the course!",
});

uploadData({
  type: "learning-progress",
  course: "Remote Data",
  completed: true,
  score: 95,
});

printData("All POST requests sent!");
```
