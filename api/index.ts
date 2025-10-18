import express, { type Request, Response, NextFunction } from "express";
import { type User, type InsertUser, type FertilizerRecord, type DashboardMetrics, type TopFertilizer } from "../shared/schema";
import { randomUUID } from "crypto";
import { data as fertilizerData } from "../shared/fertilizer-data";
import { z } from "zod";

// ============ STORAGE ============
interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFertilizerData(filters?: {
    state?: string;
    product?: string;
    year?: string;
    month?: string;
  }): Promise<FertilizerRecord[]>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getTopRequiredFertilizers(): Promise<TopFertilizer[]>;
  getLeastAvailableFertilizers(): Promise<TopFertilizer[]>;
  getMonthlyTrends(product: string): Promise<Array<{ month: string; requirement: number; availability: number }>>;
}

class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fertilizerData: FertilizerRecord[];

  constructor() {
    this.users = new Map();
    this.fertilizerData = fertilizerData as FertilizerRecord[];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFertilizerData(filters?: {
    state?: string;
    product?: string;
    year?: string;
    month?: string;
  }): Promise<FertilizerRecord[]> {
    let result = [...this.fertilizerData];

    if (filters) {
      if (filters.state) {
        result = result.filter((item) => item.state === filters.state);
      }
      if (filters.product) {
        result = result.filter((item) => item.product === filters.product);
      }
      if (filters.year) {
        result = result.filter((item) => item._year === filters.year);
      }
      if (filters.month) {
        result = result.filter((item) => item.month === filters.month);
      }
    }

    return result;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const uniqueStates = new Set(this.fertilizerData.map((item) => item.state));
    const uniqueProducts = new Set(this.fertilizerData.map((item) => item.product));

    const criticalShortages = this.fertilizerData.filter((item) => {
      const requirement = parseFloat(item.requirement_in_mt_) || 0;
      const availability = parseFloat(item.availability_in_mt_) || 0;
      return requirement > 0 && availability < requirement;
    }).length;

    const totalAvailability = this.fertilizerData.reduce((sum, item) => {
      return sum + (parseFloat(item.availability_in_mt_) || 0);
    }, 0);

    const averageAvailability = Math.round(totalAvailability / this.fertilizerData.length);

    return {
      totalStates: uniqueStates.size,
      totalFertilizerTypes: uniqueProducts.size,
      criticalShortages,
      averageAvailability,
    };
  }

  async getTopRequiredFertilizers(): Promise<TopFertilizer[]> {
    const productRequirements = new Map<string, number>();

    this.fertilizerData.forEach((item) => {
      const requirement = parseFloat(item.requirement_in_mt_) || 0;
      const existing = productRequirements.get(item.product) || 0;
      productRequirements.set(item.product, existing + requirement);
    });

    const sorted = Array.from(productRequirements.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const maxValue = sorted[0]?.[1] || 1;

    return sorted.map(([product, value]) => ({
      product,
      value: Math.round(value),
      percentage: Math.round((value / maxValue) * 100),
    }));
  }

  async getLeastAvailableFertilizers(): Promise<TopFertilizer[]> {
    const productAvailability = new Map<string, number>();

    this.fertilizerData.forEach((item) => {
      const availability = parseFloat(item.availability_in_mt_) || 0;
      const existing = productAvailability.get(item.product) || 0;
      productAvailability.set(item.product, existing + availability);
    });

    const sorted = Array.from(productAvailability.entries())
      .filter(([, value]) => value > 0)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 5);

    const maxValue = sorted[sorted.length - 1]?.[1] || 1;

    return sorted.map(([product, value]) => ({
      product,
      value: Math.round(value),
      percentage: Math.round((value / maxValue) * 100),
    }));
  }

  async getMonthlyTrends(product: string): Promise<Array<{ month: string; requirement: number; availability: number }>> {
    const MONTH_ORDER = [
      "April", "May", "June", "July", "August", "September",
      "October", "November", "December", "January", "February", "March",
    ];

    const productData = this.fertilizerData.filter((item) => item.product === product);
    const monthlyData = new Map<string, { requirement: number; availability: number; count: number }>();

    productData.forEach((item) => {
      const existing = monthlyData.get(item.month) || { requirement: 0, availability: 0, count: 0 };
      monthlyData.set(item.month, {
        requirement: existing.requirement + (parseFloat(item.requirement_in_mt_) || 0),
        availability: existing.availability + (parseFloat(item.availability_in_mt_) || 0),
        count: existing.count + 1,
      });
    });

    return MONTH_ORDER.map((month) => {
      const data = monthlyData.get(month) || { requirement: 0, availability: 0, count: 0 };
      return {
        month,
        requirement: data.count > 0 ? Math.round(data.requirement) : 0,
        availability: data.count > 0 ? Math.round(data.availability) : 0,
      };
    }).filter((item) => item.requirement > 0 || item.availability > 0);
  }
}

const storage = new MemStorage();

// ============ EXPRESS APP ============
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// ============ API ROUTES ============
const fertilizerFiltersSchema = z.object({
  state: z.string().optional(),
  product: z.string().optional(),
  year: z.string().optional(),
  month: z.string().optional(),
});

app.get("/api/fertilizer/data", async (req: Request, res: Response) => {
  try {
    const filters = fertilizerFiltersSchema.parse(req.query);
    const data = await storage.getFertilizerData(filters);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "Invalid filters" });
  }
});

app.get("/api/fertilizer/metrics", async (req: Request, res: Response) => {
  try {
    const metrics = await storage.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.get("/api/fertilizer/top-required", async (req: Request, res: Response) => {
  try {
    const topRequired = await storage.getTopRequiredFertilizers();
    res.json(topRequired);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top required fertilizers" });
  }
});

app.get("/api/fertilizer/least-available", async (req: Request, res: Response) => {
  try {
    const leastAvailable = await storage.getLeastAvailableFertilizers();
    res.json(leastAvailable);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch least available fertilizers" });
  }
});

app.get("/api/fertilizer/trends/:product", async (req: Request, res: Response) => {
  try {
    const { product } = req.params;
    const trends = await storage.getMonthlyTrends(product);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export Express app for Vercel serverless
export default app;
