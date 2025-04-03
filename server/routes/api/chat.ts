import { Router } from 'express';
// @ts-ignore
import fetch from 'node-fetch';

const router = Router();

// API configuration
const API_KEY = 'AIzaSyBJz5UAwIAeXxbwgP8fslD8SJENJSUqU64'; // Gemini API key hardcoded directly in the code
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Type definitions for Gemini API
interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// Interface for dashboard data to use in specialized responses
interface DashboardData {
  totalPoints: number;
  pointsValue: number;
  expiringPoints: number;
}

// Mock redemption options - to be replaced with actual data in production
const redemptionOptions = [
  { name: 'Amazon Gift Card', value: 'Best value: 1 point = ₹0.50', tag: 'POPULAR' },
  { name: 'Flight Tickets', value: 'Premium offer: 1 point = ₹0.75 toward any airline', tag: 'BEST VALUE' },
  { name: 'Movie Vouchers', value: 'Special: 2000 points = 2 premium tickets', tag: 'LIMITED TIME' },
  { name: 'Cashback', value: 'Direct deposit: 1 point = ₹0.25', tag: 'INSTANT' }
];

// Top card recommendations
const cardRecommendations = [
  { bank: 'HDFC', type: 'Diners Club Black', features: '5% cashback on travel, 3x points on dining' },
  { bank: 'SBI', type: 'Elite', features: '2% cashback on all purchases, no foreign transaction fees' },
  { bank: 'Axis', type: 'Magnus', features: 'Complimentary lounge access, 10x rewards on partner merchants' }
];

// Function to generate custom responses for specific queries
function getCustomResponse(message: string, dashboard?: DashboardData): string | null {
  // Handle identity questions
  if (message.includes('who are you') || 
      message.includes('what are you') || 
      message.includes('introduce yourself') ||
      message.includes('tell me about yourself')) {
    return "I am an AI assistant developed by Team Trovo (i.e., Team Z-18) to assist you with managing your credit card points. I can help you find the best redemption options, check your point values, track expiring points, and recommend cards based on your spending habits. How can I help you today?";
  }
  
  // Handle standard queries from suggestion chips
  if (message === 'best redemption options') {
    const optionsText = redemptionOptions
      .map(opt => `• **${opt.name}**: ${opt.value} _(${opt.tag})_`)
      .join('\n');
    
    return `### Current Best Redemption Options\n\n${optionsText}\n\nYou can redeem these in the Redemption section of your Trovo dashboard. Would you like more details on any specific option?`;
  }
  
  if (message === 'value of my points') {
    if (dashboard) {
      return `Your ${dashboard.totalPoints.toLocaleString()} points are currently worth **₹${dashboard.pointsValue.toLocaleString()}**. This is based on our standard valuation of points across your different cards. You can increase this value by choosing high-value redemption options like travel bookings or gift cards during special promotions.`;
    } else {
      return `Based on your dashboard, your total points are worth approximately ₹22,500. This is calculated using our standard valuation model. For the most accurate and up-to-date value, please check your main dashboard.`;
    }
  }
  
  if (message === 'expiring points') {
    if (dashboard) {
      if (dashboard.expiringPoints > 0) {
        return `⚠️ **Alert: Expiring Points**\n\nYou have **${dashboard.expiringPoints.toLocaleString()} points** expiring within the next 30 days. I recommend redeeming these points soon to avoid losing them. Would you like suggestions on quick redemption options?`;
      } else {
        return `Great news! You don't have any points expiring in the next 30 days. Your point balance is secure for now.`;
      }
    } else {
      return `I don't see any points expiring in the immediate future. However, it's always good practice to regularly check your expiration dates on the dashboard. Most credit card points expire after 1-3 years of inactivity.`;
    }
  }
  
  if (message === 'card recommendations') {
    const cardsText = cardRecommendations
      .map(card => `• **${card.bank} ${card.type}**: ${card.features}`)
      .join('\n');
    
    return `### Top Card Recommendations For You\n\n${cardsText}\n\nThese recommendations are based on popular cards with strong rewards programs. For personalized recommendations based on your specific spending habits, please visit the Cards section of your dashboard.`;
  }
  
  if (message === 'payment help') {
    return `To make a payment on your credit card:\n\n1. Go to the Payments section in the Trovo app\n2. Select the card you want to make a payment for\n3. Enter the payment amount\n4. Choose your payment method (UPI, Bank Transfer, etc.)\n5. Confirm the payment\n\nPayments typically reflect within 1-2 business days. Would you like help with anything else related to payments?`;
  }
  
  // No custom response needed, use the AI model
  return null;
}

// Handle chat completions
router.post('/completions', async (req, res) => {
  try {
    const { messages, dashboardData } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    // Get the latest user message
    const latestUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content?.toLowerCase() || '';
    
    // Check if we should handle this message with a custom response
    const customResponse = getCustomResponse(latestUserMessage, dashboardData);
    if (customResponse) {
      return res.json({
        id: `trovo-${Date.now()}`,
        choices: [{
          message: {
            role: 'assistant',
            content: customResponse
          }
        }]
      });
    }
    
    // If not a custom response, add our custom system prompt to ensure consistent identity
    const systemPrompt = {
      role: "system",
      content: "You are Trovo Assistant, developed by team Trovo (i.e., Team Z-18) to assist customers with their credit card points management. Always identify yourself as 'Trovo Assistant' not as Gemini or any other AI. Be friendly, helpful, concise, and maintain a professional tone. Focus on credit card points management, redemption options, and maximizing value. If users ask specific account questions you can't answer, guide them to the relevant section of the app. Use Indian Rupee (₹) symbols when discussing monetary values."
    };
    
    // Prepare messages with our custom system prompt
    const messageList = messages.slice(-10); // Keep last 10 messages for context
    messageList.unshift(systemPrompt);
    
    // Convert chat messages to Gemini format
    const geminiMessages = messageList.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Make request to Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from Trovo Assistant',
        details: errorData
      });
    }
    
    const data = await response.json() as GeminiResponse;
    
    // Convert Gemini response to ChatGPT-like format for compatibility
    const formattedResponse = {
      id: `trovo-${Date.now()}`,
      choices: [{
        message: {
          role: 'assistant',
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
        }
      }]
    };
    
    return res.json(formattedResponse);
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;