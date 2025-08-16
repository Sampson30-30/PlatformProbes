import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectRequestSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Project request endpoint
  app.post("/api/project-requests", async (req, res) => {
    try {
      const validatedData = insertProjectRequestSchema.parse(req.body);
      const projectRequest = await storage.createProjectRequest(validatedData);
      res.json({ success: true, data: projectRequest });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation error", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Get all project requests (for admin purposes)
  app.get("/api/project-requests", async (req, res) => {
    try {
      const requests = await storage.getAllProjectRequests();
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
