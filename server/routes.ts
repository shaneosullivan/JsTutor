import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
