import { User, InsertUser, Card, InsertCard, Transaction, InsertTransaction, Redemption, InsertRedemption } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User related
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Card related
  getCards(userId: number): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, cardData: Partial<Card>): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
  
  // Transaction related
  getTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  getCardTransactions(cardId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Redemption related
  getRedemptions(userId: number): Promise<Redemption[]>;
  createRedemption(redemption: InsertRedemption): Promise<Redemption>;
  
  // Sum of points
  getTotalPoints(userId: number): Promise<number>;
  getExpiringPoints(userId: number, daysThreshold?: number): Promise<number>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private transactions: Map<number, Transaction>;
  private redemptions: Map<number, Redemption>;
  currentId: { users: number; cards: number; transactions: number; redemptions: number };
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.transactions = new Map();
    this.redemptions = new Map();
    this.currentId = {
      users: 1,
      cards: 1,
      transactions: 1,
      redemptions: 1,
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, preferences: '{"notifications": true, "theme": "light"}' };
    this.users.set(id, user);
    return user;
  }

  // Card methods
  async getCards(userId: number): Promise<Card[]> {
    return Array.from(this.cards.values()).filter(
      (card) => card.userId === userId,
    );
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.currentId.cards++;
    const card: Card = { 
      ...insertCard, 
      id,
      points: insertCard.points ?? 0,
      pointsExpiryDate: insertCard.pointsExpiryDate ?? null
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: number, cardData: Partial<Card>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard = { ...card, ...cardData };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }

  // Transaction methods
  async getTransactions(userId: number, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async getCardTransactions(cardId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.cardId === cardId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId.transactions++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    
    // Update card points
    const card = await this.getCard(transaction.cardId);
    if (card) {
      await this.updateCard(card.id, {
        points: card.points + transaction.pointsEarned
      });
    }
    
    return transaction;
  }

  // Redemption methods
  async getRedemptions(userId: number): Promise<Redemption[]> {
    return Array.from(this.redemptions.values())
      .filter((redemption) => redemption.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createRedemption(insertRedemption: InsertRedemption): Promise<Redemption> {
    const id = this.currentId.redemptions++;
    const redemption: Redemption = { 
      ...insertRedemption, 
      id,
      status: insertRedemption.status || 'completed'
    };
    this.redemptions.set(id, redemption);
    
    // Update card points
    const card = await this.getCard(redemption.cardId);
    if (card) {
      await this.updateCard(card.id, {
        points: card.points - redemption.pointsUsed
      });
    }
    
    return redemption;
  }

  // Points calculations
  async getTotalPoints(userId: number): Promise<number> {
    const userCards = await this.getCards(userId);
    return userCards.reduce((total, card) => total + card.points, 0);
  }

  async getExpiringPoints(userId: number, daysThreshold = 30): Promise<number> {
    const userCards = await this.getCards(userId);
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    return userCards.reduce((total, card) => {
      if (card.pointsExpiryDate) {
        const expiryDate = new Date(card.pointsExpiryDate);
        if (expiryDate <= thresholdDate) {
          return total + card.points;
        }
      }
      return total;
    }, 0);
  }
}

// Use MemStorage 
export const storage = new MemStorage();
