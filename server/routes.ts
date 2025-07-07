import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
