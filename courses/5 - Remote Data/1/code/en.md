---
version: 1
---

```javascript
// Let's fetch some data from a server!
// We'll use a test API that returns fake data

async function fetchUserData() {
  try {
    printData("Fetching user data...");

    // Make a request to get user information
    let response = await fetch("/api/test-data/user");

    if (response.ok) {
      let userData = await response.json();
      printData("User data received:");
      printData(userData);
    } else {
      printData("Error: Could not fetch user data");
      printData("Status:", response.status);
    }
  } catch (error) {
    printData("Network error:", error.message);
  }
}

async function fetchPostList() {
  try {
    printData("Fetching blog posts...");

    let response = await fetch("/api/test-data/posts");

    if (response.ok) {
      let posts = await response.json();
      printData("Blog posts received:");
      printData(posts);

      // Let's display just the titles
      printData("Post titles:");
      posts.forEach((post, index) => {
        printData(`${index + 1}. ${post.title}`);
      });
    } else {
      printData("Error fetching posts");
    }
  } catch (error) {
    printData("Error:", error.message);
  }
}

// Make the requests
fetchUserData();
fetchPostList();

printData("---");
printData("Requests sent! Waiting for responses...");
```
