import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertUserSchema, insertUserProgressSchema } from "../shared/schema.js";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Course endpoints
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/:id/tutorials", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const tutorials = await storage.getTutorialsByCourse(courseId);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course tutorials" });
    }
  });

  // Get all tutorials
  app.get("/api/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getAllTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tutorials" });
    }
  });

  // Get specific tutorial
  app.get("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tutorial = await storage.getTutorial(id);
      if (!tutorial) {
        return res.status(404).json({ error: "Tutorial not found" });
      }
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tutorial" });
    }
  });

  // Get user progress (using session or default user for demo)
  app.get("/api/progress", async (req, res) => {
    try {
      // For demo purposes, use a default user ID of 1
      // In a real app, this would come from authentication
      const userId = 1;
      
      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        // Create default user and progress if they don't exist
        const user = await storage.createUser({ username: "demo", password: "demo" });
        progress = await storage.getUserProgress(user.id);
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const progressData = insertUserProgressSchema.parse(req.body);
      
      const updatedProgress = await storage.updateUserProgress(userId, progressData);
      res.json(updatedProgress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  // Execute code (for now, just return success - in a real app, this would sandbox and execute)
  app.post("/api/execute", async (req, res) => {
    try {
      const { code } = req.body;
      
      // For demo purposes, just return success
      // In a real implementation, you'd want to safely execute the code
      res.json({ 
        success: true, 
        output: "Code executed successfully! 🎨",
        logs: ["Great job! Your code is working perfectly."]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to execute code" });
    }
  });

  // API key validation endpoint
  app.post("/api/validate-api-key", async (req, res) => {
    try {
      const { apiKey } = req.body;

      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }

      // Test the API key with a simple request
      const testOpenai = new OpenAI({ apiKey });
      
      await testOpenai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5,
      });

      res.json({ valid: true });
    } catch (error) {
      console.error("API key validation error:", error);
      res.status(400).json({ error: "Invalid API key" });
    }
  });

  // AI Assistant endpoint
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { messages, tutorialId, code, isFirstMessage, apiKey } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }

      const openai = new OpenAI({ apiKey });

      let systemMessage = `You are a friendly AI assistant helping a 9-year-old child learn JavaScript programming. 

Current Code: ${code || "No code yet"}

IMPORTANT RULES:
1. NEVER write or fix code for the child - only explain what might be wrong and how they can fix it
2. Use simple, encouraging language appropriate for a 9-year-old
3. Keep responses BRIEF (2-3 sentences max) - children have short attention spans
4. If there are bugs, explain them step by step
5. Suggest next steps but let the child implement them
6. Focus on learning and understanding, not just getting the "right" answer
7. Always use the provided drawing functions - DON'T suggest rewriting them
8. ALWAYS mention specific line numbers when discussing code (e.g., "On line 3, you wrote...")
9. When explaining errors, reference the exact line number where the problem occurs

Available drawing functions they can use:
- drawCircle(x, y, radius, color)
- drawRect(x, y, width, height, color)  
- drawLine(x1, y1, x2, y2, color)
- drawText(x, y, text, color)
- drawPixel(x, y, color)
- clearCanvas()

Canvas size is 400x400 pixels, with (0,0) at top-left corner.`;
      
      if (isFirstMessage && tutorialId) {
        // Get tutorial context for first message
        const tutorial = await storage.getTutorial(tutorialId);
        if (tutorial) {
          systemMessage += `

Current Tutorial: "${tutorial.title}"
Tutorial Description: ${tutorial.description}
Tutorial Content: ${tutorial.content}`;
        }
      }

      const chatMessages = systemMessage 
        ? [{ role: "system", content: systemMessage }, ...messages]
        : messages;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0].message.content;
      
      res.json({
        message: assistantMessage,
        usage: response.usage
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Test data endpoints for Remote Data course
  app.get("/api/test-data/user", (req, res) => {
    res.json({
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 25,
      city: "New York"
    });
  });

  app.get("/api/test-data/user/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (id === 1) {
      res.json({ id: 1, name: "Alice Johnson", email: "alice@example.com" });
    } else if (id === 2) {
      res.json({ id: 2, name: "Bob Smith", email: "bob@example.com" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/test-data/posts", (req, res) => {
    res.json([
      { id: 1, title: "Learning JavaScript", content: "JavaScript is awesome!", author: "Alice" },
      { id: 2, title: "Web Development Tips", content: "Here are some tips...", author: "Bob" },
      { id: 3, title: "API Design", content: "Good API design is important", author: "Charlie" }
    ]);
  });

  app.get("/api/test-data/posts/search", (req, res) => {
    const query = req.query.q as string;
    const allPosts = [
      { id: 1, title: "Learning JavaScript", content: "JavaScript is awesome!" },
      { id: 2, title: "Web Development Tips", content: "Here are some tips..." },
      { id: 3, title: "API Design", content: "Good API design is important" }
    ];
    
    const results = allPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(results);
  });

  app.get("/api/test-data/protected", (req, res) => {
    const auth = req.headers.authorization;
    if (auth === "Bearer demo-token") {
      res.json({ secret: "This is protected data!", timestamp: new Date().toISOString() });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  app.post("/api/test-data/users", (req, res) => {
    const userData = req.body;
    res.status(201).json({
      id: Math.floor(Math.random() * 1000),
      ...userData,
      createdAt: new Date().toISOString()
    });
  });

  app.post("/api/test-data/contact", (req, res) => {
    const formData = req.body;
    res.json({
      message: "Thank you for your message!",
      id: Math.floor(Math.random() * 1000),
      submittedAt: new Date().toISOString(),
      data: formData
    });
  });

  app.post("/api/test-data/upload", (req, res) => {
    const data = req.body;
    res.json({
      message: "Data uploaded successfully",
      uploadId: Math.floor(Math.random() * 1000),
      size: JSON.stringify(data).length,
      uploadedAt: new Date().toISOString()
    });
  });

  app.get("/api/test-data/success", (req, res) => {
    res.json({ message: "Success!" });
  });

  app.get("/api/test-data/notfound", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.get("/api/test-data/server-error", (req, res) => {
    res.status(500).json({ error: "Internal server error" });
  });

  app.get("/api/test-data/timeout", (req, res) => {
    // Simulate a long request
    setTimeout(() => {
      res.json({ message: "Finally completed" });
    }, 10000);
  });

  app.get("/api/test-data/unreliable", (req, res) => {
    // Randomly fail to simulate unreliable endpoint
    if (Math.random() < 0.7) {
      res.status(500).json({ error: "Service temporarily unavailable" });
    } else {
      res.json({ message: "Success after retry!" });
    }
  });

  app.get("/api/test-data/todos", (req, res) => {
    res.json([
      { id: 1, text: "Learn JavaScript", completed: true },
      { id: 2, text: "Build a todo app", completed: false },
      { id: 3, text: "Deploy to production", completed: false }
    ]);
  });

  app.post("/api/test-data/todos", (req, res) => {
    const todoData = req.body;
    res.status(201).json({
      id: Math.floor(Math.random() * 1000),
      ...todoData,
      createdAt: new Date().toISOString()
    });
  });

  app.put("/api/test-data/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    res.json({
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
