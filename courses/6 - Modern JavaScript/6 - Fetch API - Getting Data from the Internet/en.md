---
id: "fetch-api-getting-data-from-the-internet"
courseId: "modern-javascript"
title: "Fetch API - Getting Data from the Internet"
description: "Learn about the Fetch API - the modern way to get data from websites!"
expectedOutput: "Messages showing how to fetch data from the internet"
order: 6
version: 1
---



## What is the Fetch API?

The Fetch API is JavaScript's **modern way** to get information from the internet! It's like sending a messenger to another website to bring back information.

### 🤔 Why is Fetch Better?

In the old days, getting data from the internet was complicated and messy. Fetch makes it **super easy** and uses promises (which you just learned about)!

### 🌐 What Can You Fetch?

- **JSON data** - Information in a special format
- **Text** - Regular text from websites
- **Images** - Pictures from the internet
- **API data** - Information from other apps

### 📝 How Fetch Works:

1. **Send a request** - "Hey website, can I have some data?"
2. **Wait for response** - The website sends back information
3. **Process the data** - Turn it into something we can use

### 🎯 Fetch Steps:

1. `fetch(url)` - Ask for data from a website
2. `.then(response => response.json())` - Turn the response into usable data
3. `.then(data => { /* use the data */ })` - Do something with the data

### 🚀 Your Mission:

Learn to use fetch to get cool data from the internet!