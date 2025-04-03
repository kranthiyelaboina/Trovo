import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertCardSchema, insertTransactionSchema, insertRedemptionSchema } from "@shared/schema";
import chatRouter from "./routes/api/chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Set up chat API routes
  app.use('/api/chat', chatRouter);

  // Card routes
  app.get("/api/cards", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const cards = await storage.getCards(req.user.id);
      res.json(cards);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cards/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const card = await storage.getCard(parseInt(req.params.id));
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      res.json(card);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cards", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertCardSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/cards/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const cardId = parseInt(req.params.id);
      const card = await storage.getCard(cardId);
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      
      const updatedCard = await storage.updateCard(cardId, req.body);
      res.json(updatedCard);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cards/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const cardId = parseInt(req.params.id);
      const card = await storage.getCard(cardId);
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      
      await storage.deleteCard(cardId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getTransactions(req.user.id, limit);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cards/:id/transactions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const cardId = parseInt(req.params.id);
      const card = await storage.getCard(cardId);
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      
      const transactions = await storage.getCardTransactions(cardId);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/transactions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if card belongs to user
      const card = await storage.getCard(validatedData.cardId);
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  });

  // Redemption routes
  app.get("/api/redemptions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const redemptions = await storage.getRedemptions(req.user.id);
      res.json(redemptions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/redemptions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validatedData = insertRedemptionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if card belongs to user
      const card = await storage.getCard(validatedData.cardId);
      if (!card) return res.status(404).send("Card not found");
      if (card.userId !== req.user.id) return res.sendStatus(403);
      
      // Check if card has enough points
      if (card.points < validatedData.pointsUsed) {
        return res.status(400).send("Insufficient points");
      }
      
      const redemption = await storage.createRedemption(validatedData);
      res.status(201).json(redemption);
    } catch (error) {
      next(error);
    }
  });

  // Dashboard data
  app.get("/api/dashboard", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const totalPoints = await storage.getTotalPoints(req.user.id);
      const expiringPoints = await storage.getExpiringPoints(req.user.id);
      const cards = await storage.getCards(req.user.id);
      const recentTransactions = await storage.getTransactions(req.user.id, 5);
      
      // Calculate points value
      let pointsValue = 0;
      for (const card of cards) {
        // Use mock data service conversion rates - this would be better in a real app
        // but we're keeping it simple for the demo
        const conversionRate = 0.25; // Default fallback rate
        pointsValue += card.points * conversionRate;
      }
      
      res.json({
        totalPoints,
        expiringPoints,
        pointsValue,
        cards,
        recentTransactions
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
