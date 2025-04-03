import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = 'gpt-4o';

// OpenAI service for AI chatbot integration
export class OpenAIService {
  private openai: OpenAI | null = null;
  private initialized = false;

  constructor() {
    // Try to initialize with environment variable if available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.initialize(apiKey);
    } else {
      this.initialized = false;
    }
  }

  public initialize(apiKey: string): boolean {
    try {
      this.openai = new OpenAI({ apiKey });
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.initialized = false;
      return false;
    }
  }
  
  public isInitialized(): boolean {
    return this.initialized;
  }

  public async getChatCompletion(message: string): Promise<string> {
    if (!this.initialized || !this.openai) {
      throw new Error('OpenAI service not initialized. Please provide an API key.');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a credit card points management platform named CredPal. Your role is to help users understand how to manage their credit card points, redeem rewards, and navigate the platform. Be concise, friendly, and informative.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      });

      return completion.choices[0].message.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error getting chat completion:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again later.';
    }
  }
}

// Create a singleton instance
const openAIService = new OpenAIService();
export default openAIService;