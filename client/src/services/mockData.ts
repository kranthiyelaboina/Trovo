import { Bank, RedemptionOption } from "@shared/schema";

// Mock bank data
const banks: Bank[] = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    cardTypes: ["Regalia", "Millennia", "Diners Club"],
    conversionRates: {
      "Regalia": 0.25, // 1 point = ₹0.25
      "Millennia": 0.20,
      "Diners Club": 0.33
    }
  },
  {
    id: "icici",
    name: "ICICI Bank",
    logo: "/assets/banks/icici.png",
    cardTypes: ["Amazon Pay", "Coral", "Platinum"],
    conversionRates: {
      "Amazon Pay": 0.30,
      "Coral": 0.25,
      "Platinum": 0.20
    }
  },
  {
    id: "sbi",
    name: "State Bank of India",
    logo: "/assets/banks/sbi.png",
    cardTypes: ["SimplySave", "SimplyClick", "Elite"],
    conversionRates: {
      "SimplySave": 0.20,
      "SimplyClick": 0.25,
      "Elite": 0.30
    }
  },
  {
    id: "axis",
    name: "Axis Bank",
    logo: "/assets/banks/axis.png",
    cardTypes: ["Neo", "Privilege", "Reserve"],
    conversionRates: {
      "Neo": 0.20,
      "Privilege": 0.25,
      "Reserve": 0.35
    }
  }
];

// Mock redemption options
const redemptionOptions: RedemptionOption[] = [
  {
    id: "cb1",
    name: "Statement Credit",
    description: "Apply points directly to your card statement",
    conversionRate: 0.25,
    minPoints: 1000,
    category: "Cashback",
    icon: "credit-card",
    tag: {
      text: "Best Value",
      type: "best"
    }
  },
  {
    id: "fl1",
    name: "Flight Booking",
    description: "Use points to book domestic flights",
    conversionRate: 0.30,
    minPoints: 5000,
    category: "Travel",
    icon: "plane",
    tag: {
      text: "Expiring Points",
      type: "expiring"
    }
  },
  {
    id: "az1",
    name: "Amazon Gift Card",
    description: "Convert points to Amazon shopping credits",
    conversionRate: 0.20,
    minPoints: 0,
    category: "Shopping",
    icon: "shopping-bag",
    tag: {
      text: "Popular",
      type: "popular"
    }
  },
  {
    id: "ht1",
    name: "Hotel Booking",
    description: "Redeem points for hotel stays",
    conversionRate: 0.28,
    minPoints: 3000,
    category: "Travel",
    icon: "hotel",
    tag: {
      text: "Limited Time",
      type: "limited"
    }
  },
  {
    id: "gp1",
    name: "Google Play Credit",
    description: "Get credits for apps and games",
    conversionRate: 0.22,
    minPoints: 500,
    category: "Shopping",
    icon: "phone",
    tag: null
  },
  {
    id: "fp1",
    name: "Fuel Points",
    description: "Redeem points at participating fuel stations",
    conversionRate: 0.25,
    minPoints: 1000,
    category: "Lifestyle",
    icon: "fuel",
    tag: null
  },
  {
    id: "nf1",
    name: "Netflix Subscription",
    description: "Apply points toward your Netflix subscription",
    conversionRate: 0.20,
    minPoints: 1500,
    category: "Entertainment",
    icon: "tv",
    tag: null
  },
  {
    id: "ch1",
    name: "Charity Donation",
    description: "Contribute to charitable causes",
    conversionRate: 0.30,
    minPoints: 1000,
    category: "Lifestyle",
    icon: "heart",
    tag: {
      text: "Give Back",
      type: "best"
    }
  },
];

// Helper functions to access the mock data
export function getAllBanks(): Bank[] {
  return banks;
}

export function getBankById(id: string): Bank | undefined {
  return banks.find(bank => bank.id === id);
}

export function getRedemptionOptions(): RedemptionOption[] {
  return redemptionOptions;
}

export function getRedemptionOptionById(id: string): RedemptionOption | undefined {
  return redemptionOptions.find(option => option.id === id);
}

export function getRedemptionOptionsByCategory(category: string): RedemptionOption[] {
  return redemptionOptions.filter(option => option.category === category);
}

// Get unique redemption categories
export function getRedemptionCategories(): string[] {
  const categories = new Set(redemptionOptions.map(option => option.category));
  return Array.from(categories);
}
