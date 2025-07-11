---
version: 1
---

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>Creating Elements</title>
</head>
<body>
    <h1>Element Creator</h1>
    <button id="addBtn">Add Paragraph</button>
    <button id="addListBtn">Add List Item</button>
    <button id="clearBtn">Clear All</button>
    <div id="container"></div>
    <ul id="list"></ul>

    <script>
        let container = document.getElementById('container');
        let list = document.getElementById('list');
        let counter = 1;

        // Add paragraph button
        document.getElementById('addBtn').addEventListener('click', () => {
            // Create new paragraph element
            let newParagraph = document.createElement('p');
            newParagraph.textContent = `This is paragraph number ${counter}`;
            newParagraph.style.color = 'blue';

            // Add it to the container
            container.appendChild(newParagraph);
            counter++;
        });

        // Add list item button
        document.getElementById('addListBtn').addEventListener('click', () => {
            let newListItem = document.createElement('li');
            newListItem.textContent = `List item ${counter}`;
            list.appendChild(newListItem);
            counter++;
        });

        // Clear all button
        document.getElementById('clearBtn').addEventListener('click', () => {
            container.innerHTML = '';
            list.innerHTML = '';
            counter = 1;
        });

        // Create some elements automatically
        for (let i = 1; i <= 3; i++) {
            let div = document.createElement('div');
            div.textContent = `Auto-created div ${i}`;
            div.style.backgroundColor = 'lightblue';
            div.style.margin = '5px';
            div.style.padding = '10px';
            container.appendChild(div);
        }
    </script>
</body>
</html>
```
