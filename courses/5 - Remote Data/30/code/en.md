---
version: 1
---

```javascript
// Different types of GET requests

// 1. Get a single item by ID
async function getUserById(id) {
  try {
    printData(`Getting user with ID: ${id}`);

    let response = await fetch(`/api/test-data/user/${id}`);

    if (response.ok) {
      let user = await response.json();
      printData("User found:");
      printData(user);
    } else if (response.status === 404) {
      printData("User not found!");
    } else {
      printData("Error:", response.status);
    }
  } catch (error) {
    printData("Network error:", error.message);
  }
}

// 2. Get a list with query parameters
async function searchPosts(query) {
  try {
    printData(`Searching for posts about: ${query}`);

    let response = await fetch(`/api/test-data/posts/search?q=${query}`);

    if (response.ok) {
      let results = await response.json();
      printData("Search results:");
      printData(results);

      if (results.length === 0) {
        printData("No posts found matching your search.");
      }
    } else {
      printData("Search failed:", response.status);
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// 3. Get data with headers
async function getProtectedData() {
  try {
    printData("Getting protected data...");

    let response = await fetch("/api/test-data/protected", {
      headers: {
        Authorization: "Bearer demo-token",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      let data = await response.json();
      printData("Protected data:");
      printData(data);
    } else if (response.status === 401) {
      printData("Unauthorized: Need valid token");
    } else {
      printData("Error:", response.status);
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// Test all different GET requests
getUserById(1);
getUserById(999); // This should give a 404 error
searchPosts("javascript");
getProtectedData();

printData("All GET requests sent!");
```
