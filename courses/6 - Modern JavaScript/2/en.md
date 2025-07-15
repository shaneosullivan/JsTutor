---
id: 2
courseId: 6
title: "Template Literals - Super Cool String Powers"
description: "Learn about template literals - the awesome new way to work with text!"
expectedOutput: "Messages created using template literals with variables inside"
order: 2
version: 1
---

## What are Template Literals?

Template literals are a **super cool** new way to work with text (strings) in JavaScript! Instead of using regular quotes `"` or `'`, you use **backticks** `` ` ``.

### 🤔 Why Are They Better?

With the old way, if you wanted to put a variable inside text, you had to do this:
```javascript
let name = "Alex";
let age = 9;
let message = "Hi, I'm " + name + " and I'm " + age + " years old!";
```

That's a lot of `+` signs and quotes! 😵

### ✨ The New Way is Much Easier!

With template literals, you can put variables **directly inside** the text:
```javascript
let name = "Alex";
let age = 9;
let message = `Hi, I'm ${name} and I'm ${age} years old!`;
```

See how much cleaner that is? The `${}` is like a **magic window** where you can put any variable!

### 🎯 Cool Features:

1. **Variables inside text**: Use `${variableName}` to put variables right in your text
2. **Multiple lines**: You can write text that goes on many lines
3. **Math inside**: You can even do math like `${5 + 3}` right in the text!

### 🚀 Your Mission:

Try using template literals to create cool messages with variables inside!