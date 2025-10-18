import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface FertilizerRecord {
  id: number;
  _year: string;
  month: string;
  product: string;
  state: string;
  requirement_in_mt_: string;
  availability_in_mt_: string;
}

export interface DashboardMetrics {
  totalStates: number;
  totalFertilizerTypes: number;
  criticalShortages: number;
  averageAvailability: number;
}

export interface MonthlyTrend {
  month: string;
  requirement: number;
  availability: number;
}

export interface TopFertilizer {
  product: string;
  value: number;
  percentage: number;
}

export interface FertilizerFilters {
  state?: string;
  product?: string;
  year?: string;
  month?: string;
}
