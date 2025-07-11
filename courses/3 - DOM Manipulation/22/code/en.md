---
version: 1
---

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>Changing Styles</title>
    <style>
        .highlight { background-color: yellow; }
        .big-text { font-size: 24px; }
        .colorful { color: rainbow; }
    </style>
</head>
<body>
    <h1 id="title">Style Me!</h1>
    <p id="text">This text will change styles.</p>
    <button id="colorBtn">Change Colors</button>
    <button id="sizeBtn">Change Size</button>
    <div id="box" style="width: 100px; height: 100px; background: blue;"></div>

    <script>
        let title = document.getElementById('title');
        let text = document.getElementById('text');
        let box = document.getElementById('box');

        // Change styles directly
        title.style.color = 'red';
        title.style.fontSize = '36px';

        // Add a CSS class
        text.classList.add('highlight');

        // Button to change colors
        document.getElementById('colorBtn').addEventListener('click', () => {
            box.style.backgroundColor = 'green';
            title.style.color = 'purple';
        });

        // Button to change size
        document.getElementById('sizeBtn').addEventListener('click', () => {
            text.classList.add('big-text');
            box.style.width = '200px';
            box.style.height = '200px';
        });

        // Make the box move
        let position = 0;
        setInterval(() => {
            position += 1;
            box.style.marginLeft = position + 'px';
            if (position > 100) position = 0;
        }, 50);
    </script>
</body>
</html>
```
