import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  preferences: text("preferences").default('{"notifications": true, "theme": "light"}')
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bankId: text("bank_id").notNull(),
  cardType: text("card_type").notNull(),
  lastFourDigits: text("last_four_digits").notNull(),
  expiryDate: text("expiry_date").notNull(),
  points: integer("points").notNull().default(0),
  pointsExpiryDate: text("points_expiry_date"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  pointsEarned: integer("points_earned").notNull(),
});

export const redemptions = pgTable("redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  optionId: text("option_id").notNull(),
  pointsUsed: integer("points_used").notNull(),
  valueObtained: integer("value_obtained").notNull(),
  status: text("status").notNull().default("completed"),
  date: timestamp("date").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertCardSchema = createInsertSchema(cards).pick({
  userId: true,
  bankId: true,
  cardType: true,
  lastFourDigits: true,
  expiryDate: true,
  points: true,
  pointsExpiryDate: true,
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .pick({
    cardId: true,
    userId: true,
    date: true,
    description: true,
    amount: true,
    pointsEarned: true,
  })
  .extend({
    // Ensure we can accept either Date objects or ISO strings
    date: z.union([
      z.date(),
      z.string().transform(str => new Date(str))
    ])
  });

export const insertRedemptionSchema = createInsertSchema(redemptions)
  .pick({
    userId: true,
    cardId: true,
    optionId: true,
    pointsUsed: true,
    valueObtained: true,
    status: true,
    date: true,
  })
  .extend({
    // Ensure we can accept either Date objects or ISO strings
    date: z.union([
      z.date(),
      z.string().transform(str => new Date(str))
    ])
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type Redemption = typeof redemptions.$inferSelect;

export type Bank = {
  id: string;
  name: string;
  logo: string;
  cardTypes: string[];
  conversionRates: Record<string, number>;
};

export type RedemptionOption = {
  id: string;
  name: string;
  description: string;
  conversionRate: number;
  minPoints: number;
  category: string;
  icon: string;
  tag?: {
    text: string;
    type: "best" | "expiring" | "popular" | "limited";
  };
};
