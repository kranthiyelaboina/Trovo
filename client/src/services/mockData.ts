import { Bank, RedemptionOption } from "@shared/schema";

// Mock bank data
const banks: Bank[] = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    logo: "/assets/banks/hdfc.png",
    cardTypes: ["Regalia", "Millennia", "Diners Club", "RuPay Platinum", "RuPay Select"],
    conversionRates: {
      "Regalia": 0.25, // 1 point = ₹0.25
      "Millennia": 0.20,
      "Diners Club": 0.33,
      "RuPay Platinum": 0.22,
      "RuPay Select": 0.30
    }
  },
  {
    id: "icici",
    name: "ICICI Bank",
    logo: "/assets/banks/icici.png",
    cardTypes: ["Amazon Pay", "Coral", "Platinum", "RuPay Business", "RuPay Premium"],
    conversionRates: {
      "Amazon Pay": 0.30,
      "Coral": 0.25,
      "Platinum": 0.20,
      "RuPay Business": 0.28,
      "RuPay Premium": 0.32
    }
  },
  {
    id: "sbi",
    name: "State Bank of India",
    logo: "/assets/banks/sbi.png",
    cardTypes: ["SimplySave", "SimplyClick", "Elite", "RuPay Classic", "RuPay Gold"],
    conversionRates: {
      "SimplySave": 0.20,
      "SimplyClick": 0.25,
      "Elite": 0.30,
      "RuPay Classic": 0.18,
      "RuPay Gold": 0.26
    }
  },
  {
    id: "axis",
    name: "Axis Bank",
    logo: "/assets/banks/axis.png",
    cardTypes: ["Neo", "Privilege", "Reserve", "RuPay Platinum", "RuPay Signature"],
    conversionRates: {
      "Neo": 0.20,
      "Privilege": 0.25,
      "Reserve": 0.35,
      "RuPay Platinum": 0.22,
      "RuPay Signature": 0.30
    }
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    logo: "/assets/banks/pnb.png",
    cardTypes: ["Pride", "Global", "RuPay Standard", "RuPay Premium"],
    conversionRates: {
      "Pride": 0.18,
      "Global": 0.22,
      "RuPay Standard": 0.15,
      "RuPay Premium": 0.25
    }
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    logo: "/assets/banks/bob.png",
    cardTypes: ["Easy", "Platinum", "Premier", "RuPay Select"],
    conversionRates: {
      "Easy": 0.15,
      "Platinum": 0.22,
      "Premier": 0.28,
      "RuPay Select": 0.30
    }
  },
  {
    id: "cbi",
    name: "Central Bank of India",
    logo: "/assets/banks/cbi.png",
    cardTypes: ["Surya", "Aditya", "RuPay Kisan"],
    conversionRates: {
      "Surya": 0.18,
      "Aditya": 0.22,
      "RuPay Kisan": 0.16
    }
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    logo: "/assets/banks/kotak.png",
    cardTypes: ["Urbane", "Royale", "League", "RuPay Premium"],
    conversionRates: {
      "Urbane": 0.20,
      "Royale": 0.25,
      "League": 0.32,
      "RuPay Premium": 0.28
    }
  },
  {
    id: "idbi",
    name: "IDBI Bank",
    logo: "/assets/banks/idbi.png",
    cardTypes: ["Imperium", "Euphoria", "RuPay Platinum"],
    conversionRates: {
      "Imperium": 0.22,
      "Euphoria": 0.26,
      "RuPay Platinum": 0.24
    }
  },
  {
    id: "yes",
    name: "Yes Bank",
    logo: "/assets/banks/yes.png",
    cardTypes: ["Prosperity", "Prime", "RuPay Business"],
    conversionRates: {
      "Prosperity": 0.24,
      "Prime": 0.28,
      "RuPay Business": 0.26
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
    icon: "/assets/icons/statement-credit.svg",
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
    icon: "/assets/icons/flight.svg",
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
    icon: "/assets/icons/amazon.svg",
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
    icon: "/assets/icons/hotel.svg",
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
    icon: "/assets/icons/google-play.svg",
    tag: undefined
  },
  {
    id: "fp1",
    name: "Fuel Points",
    description: "Redeem points at participating fuel stations",
    conversionRate: 0.25,
    minPoints: 1000,
    category: "Lifestyle",
    icon: "/assets/icons/fuel.svg",
    tag: undefined
  },
  {
    id: "nf1",
    name: "Netflix Subscription",
    description: "Apply points toward your Netflix subscription",
    conversionRate: 0.20,
    minPoints: 1500,
    category: "Entertainment",
    icon: "/assets/icons/netflix.svg",
    tag: undefined
  },
  {
    id: "ch1",
    name: "Charity Donation",
    description: "Contribute to charitable causes",
    conversionRate: 0.30,
    minPoints: 1000,
    category: "Lifestyle",
    icon: "/assets/icons/charity.svg",
    tag: {
      text: "Give Back",
      type: "best"
    }
  },
  {
    id: "fl2",
    name: "Flipkart Gift Card",
    description: "Redeem points for Flipkart shopping",
    conversionRate: 0.22,
    minPoints: 1000,
    category: "Shopping",
    icon: "/assets/icons/flipkart.svg",
    tag: undefined
  },
  {
    id: "sw1",
    name: "Swiggy Food Credits",
    description: "Order food delivery with your points",
    conversionRate: 0.24,
    minPoints: 800,
    category: "Lifestyle",
    icon: "/assets/icons/swiggy.svg",
    tag: {
      text: "Popular",
      type: "popular"
    }
  },
  {
    id: "zo1",
    name: "Zomato Pro Membership",
    description: "Get Zomato Pro benefits with your points",
    conversionRate: 0.25,
    minPoints: 2000,
    category: "Lifestyle",
    icon: "/assets/icons/zomato.svg",
    tag: undefined
  },
  {
    id: "mk1",
    name: "MakeMyTrip Discount",
    description: "Get discounts on travel bookings",
    conversionRate: 0.28,
    minPoints: 3000,
    category: "Travel",
    icon: "/assets/icons/makemytrip.svg",
    tag: undefined
  },
  {
    id: "tc1",
    name: "Tata CLiQ Voucher",
    description: "Shop on Tata CLiQ with your points",
    conversionRate: 0.20,
    minPoints: 1200,
    category: "Shopping",
    icon: "/assets/icons/tatacliq.svg",
    tag: undefined
  },
  {
    id: "ub1",
    name: "Uber Ride Credits",
    description: "Use points for Uber rides across India",
    conversionRate: 0.26,
    minPoints: 1000,
    category: "Travel",
    icon: "/assets/icons/uber.svg",
    tag: undefined
  },
  {
    id: "pm1",
    name: "PhonePe Wallet",
    description: "Transfer points to PhonePe wallet",
    conversionRate: 0.25,
    minPoints: 500,
    category: "Payments",
    icon: "/assets/icons/phonepe.svg",
    tag: undefined
  },
  {
    id: "pp1",
    name: "Paytm Wallet",
    description: "Transfer points to Paytm wallet",
    conversionRate: 0.25,
    minPoints: 500,
    category: "Payments",
    icon: "/assets/icons/paytm.svg",
    tag: undefined
  }
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
