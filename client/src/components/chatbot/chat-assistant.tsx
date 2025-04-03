import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Suggestions for quick access
  const suggestions = [
    'Best redemption options',
    'Value of my points',
    'Expiring points',
    'Card recommendations',
    'Payment help'
  ];
  
  // Add welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "👋 Hello! I'm your CredPal Assistant. How can I help you with your credit card points today?"
      }]);
    }
  }, [isOpen, messages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSuggestion = (text: string) => {
    setInput(text);
    handleSend(text);
  };
  
  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare context for AI - include system prompt and last 10 messages for context
      const contextMessages = [
        {
          role: "system",
          content: "You are CredPal Assistant, an AI helper for CredPal, a credit card points management platform. Be friendly, helpful, and concise. Provide information about how to maximize credit card points value, redemption options, card management, and general advice about the platform. If you don't know something specific about a user's account, guide them to the relevant section of the app."
        },
        ...messages.slice(-10),
        { role: 'user', content: messageText }
      ];
      
      // Call the chat API
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: contextMessages }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      // Add bot response
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my knowledge base right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="bg-card mb-4 w-[350px] max-h-[500px] rounded-xl shadow-lg flex flex-col overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <h3 className="font-semibold">CredPal Assistant</h3>
            <button onClick={toggleChat} className="text-primary-foreground opacity-70 hover:opacity-100 transition-opacity">
              &times;
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto rounded-br-sm' 
                    : 'bg-muted text-muted-foreground mr-auto rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-2 p-3 max-w-[80%]">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggestions */}
          <div className="p-3 border-t border-border flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="bg-muted text-muted-foreground text-xs py-1.5 px-3 rounded-full hover:bg-muted/80 transition-colors border border-border"
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 rounded-full bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground px-4 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
      
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}