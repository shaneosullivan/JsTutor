---
version: 1
---

```javascript
// Error handling for different scenarios

// 1. Network timeout
async function fetchWithTimeout(url, timeout = 5000) {
  try {
    printData(`Fetching ${url} with ${timeout}ms timeout...`);

    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), timeout);

    let response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      let data = await response.json();
      printData("Data received:");
      printData(data);
    } else {
      printData("Server error:", response.status);
    }
  } catch (error) {
    if (error.name === "AbortError") {
      printData("Request timed out!");
    } else {
      printData("Network error:", error.message);
    }
  }
}

// 2. Retry mechanism
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      printData(`Attempt ${attempt} of ${maxRetries}`);

      let response = await fetch(url);

      if (response.ok) {
        let data = await response.json();
        printData("Success on attempt", attempt);
        printData(data);
        return data;
      } else {
        printData(`Attempt ${attempt} failed with status: ${response.status}`);

        if (attempt === maxRetries) {
          printData("All attempts failed!");
        }
      }
    } catch (error) {
      printData(`Attempt ${attempt} error: ${error.message}`);

      if (attempt === maxRetries) {
        printData("All retry attempts failed!");
      }
    }

    // Wait before retry (except on last attempt)
    if (attempt < maxRetries) {
      printData("Waiting 1 second before retry...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// 3. Handle different error types
async function handleDifferentErrors() {
  let testUrls = [
    "/api/test-data/success", // Should work
    "/api/test-data/notfound", // 404 error
    "/api/test-data/server-error", // 500 error
    "/api/test-data/timeout", // Timeout error
  ];

  for (let url of testUrls) {
    try {
      printData(`Testing: ${url}`);

      let response = await fetch(url);

      if (response.ok) {
        let data = await response.json();
        printData("✓ Success:", data);
      } else {
        // Handle specific error codes
        switch (response.status) {
          case 404:
            printData("✗ Not Found: The resource does not exist");
            break;
          case 500:
            printData("✗ Server Error: Something went wrong on the server");
            break;
          case 403:
            printData("✗ Forbidden: You do not have permission");
            break;
          default:
            printData(`✗ Error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      printData(`✗ Network Error: ${error.message}`);
    }

    printData("---");
  }
}

// Test all error handling
fetchWithTimeout("/api/test-data/user", 3000);
fetchWithRetry("/api/test-data/unreliable");
handleDifferentErrors();
```
