import { type User, type InsertUser, type FertilizerRecord, type DashboardMetrics, type TopFertilizer } from "@shared/schema";
import { randomUUID } from "crypto";
import { data as fertilizerData } from "../shared/fertilizer-data";

export interface IStorage {
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

export class MemStorage implements IStorage {
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

export const storage = new MemStorage();
