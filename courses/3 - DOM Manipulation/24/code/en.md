---
version: 1
---

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>Working with Forms</title>
</head>
<body>
    <h1>User Information Form</h1>

    <form id="userForm">
        <label for="name">Name:</label>
        <input type="text" id="name" required>
        <br><br>

        <label for="age">Age:</label>
        <input type="number" id="age" min="1" max="120">
        <br><br>

        <label for="color">Favorite Color:</label>
        <select id="color">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
        </select>
        <br><br>

        <button type="submit">Submit</button>
    </form>

    <div id="result"></div>

    <script>
        let form = document.getElementById('userForm');
        let result = document.getElementById('result');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Don't reload the page

            // Get values from form
            let name = document.getElementById('name').value;
            let age = document.getElementById('age').value;
            let color = document.getElementById('color').value;

            // Validate input
            if (!name) {
                alert('Please enter your name!');
                return;
            }

            if (!age || age < 1) {
                alert('Please enter a valid age!');
                return;
            }

            // Display result
            result.innerHTML = `
                <h2>Hello, ${name}!</h2>
                <p>You are ${age} years old.</p>
                <p>Your favorite color is <span style="color: ${color};">${color}</span>.</p>
            `;

            // Change page background to their favorite color
            document.body.style.backgroundColor = color;

            // Clear form
            form.reset();
        });

        // Live preview as they type
        document.getElementById('name').addEventListener('input', (event) => {
            let preview = document.getElementById('preview');
            if (!preview) {
                preview = document.createElement('p');
                preview.id = 'preview';
                preview.style.fontStyle = 'italic';
                form.appendChild(preview);
            }
            preview.textContent = event.target.value ? `Hello, ${event.target.value}!` : '';
        });
    </script>
</body>
</html>
```
