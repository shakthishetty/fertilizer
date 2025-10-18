import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const fertilizerFiltersSchema = z.object({
  state: z.string().optional(),
  product: z.string().optional(),
  year: z.string().optional(),
  month: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/fertilizer/data", async (req, res) => {
    try {
      const filters = fertilizerFiltersSchema.parse(req.query);
      const data = await storage.getFertilizerData(filters);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid filters" });
    }
  });

  app.get("/api/fertilizer/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/fertilizer/top-required", async (req, res) => {
    try {
      const topRequired = await storage.getTopRequiredFertilizers();
      res.json(topRequired);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top required fertilizers" });
    }
  });

  app.get("/api/fertilizer/least-available", async (req, res) => {
    try {
      const leastAvailable = await storage.getLeastAvailableFertilizers();
      res.json(leastAvailable);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch least available fertilizers" });
    }
  });

  app.get("/api/fertilizer/trends/:product", async (req, res) => {
    try {
      const { product } = req.params;
      const trends = await storage.getMonthlyTrends(product);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
