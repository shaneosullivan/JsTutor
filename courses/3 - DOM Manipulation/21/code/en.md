---
version: 1
---

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>Finding Elements</title>
</head>
<body>
    <h1 id="title">Welcome to DOM Manipulation!</h1>
    <p class="text">This is a paragraph.</p>
    <p class="text">This is another paragraph.</p>
    <button id="myButton">Click me!</button>
    <div id="output"></div>

    <script>
        // Find element by ID
        let title = document.getElementById('title');
        console.log('Found title:', title.textContent);

        // Find element by class (gets the first one)
        let firstParagraph = document.querySelector('.text');
        console.log('First paragraph:', firstParagraph.textContent);

        // Find all elements by class
        let allParagraphs = document.querySelectorAll('.text');
        console.log('Number of paragraphs:', allParagraphs.length);

        // Change some text
        title.textContent = 'I changed the title!';
        firstParagraph.textContent = 'I changed this paragraph!';

        // Change the output div
        let output = document.getElementById('output');
        output.innerHTML = '<p>I added this with JavaScript!</p>';
    </script>
</body>
</html>
```
