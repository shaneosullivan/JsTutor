---
version: 1
---

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f0f0f0;
        }
        .highlight {
            background-color: yellow;
            padding: 5px;
        }
    </style>
</head>
<body>
    <h1 id="main-title">Welcome to HTML!</h1>
    <p class="intro">This is a paragraph inside the body.</p>
    <p>HTML uses <strong>tags</strong> to structure content.</p>
    <button onclick="changeTitle()">Click me!</button>
    <div id="output"></div>

    <script>
        // The 'document' object represents the entire HTML page
        console.log('The document object:', document);

        // The 'window' object represents the browser window
        console.log('The window object:', window);

        // You can find elements by their id attribute
        let titleElement = document.getElementById('main-title');
        console.log('Found title element:', titleElement);

        function changeTitle() {
            // Find the title element each time to make sure we have it
            let titleElement = document.getElementById('main-title');

            // Change the text inside the title
            titleElement.textContent = 'I changed the title with JavaScript!';

            // Add some content to the output div
            let output = document.getElementById('output');
            output.innerHTML = '<p class="highlight">JavaScript can change HTML!</p>';

            console.log('Title changed!');
        }
    </script>
</body>
</html>
```
