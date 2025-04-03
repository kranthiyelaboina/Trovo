import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, Bot, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Interface for dashboard data
interface DashboardData {
  totalPoints: number;
  pointsValue: number;
  expiringPoints: number;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  
  // Fetch dashboard data for personalized responses
  const { data: dashboardData } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    enabled: isOpen, // Only fetch when chat is open
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
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
        content: "👋 Hello! I'm your Trovo Assistant. How can I help you with your credit card points today?"
      }]);
    }
  }, [isOpen, messages.length]);
  
  // Start pulse animation periodically
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 2000);
      }, 20000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Reset position when opening chat
    if (!isOpen) {
      setPosition({ x: 0, y: 0 });
      setPulseAnimation(false);
    }
  };
  
  const handleSuggestion = (text: string) => {
    setInput(text);
    handleSend(text);
  };
  
  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.chat-header')) {
      setIsDragging(true);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && chatWindowRef.current) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY
      });
    }
  };
  
  // Render markdown-like formatting
  const formatMessage = (content: string) => {
    // Replace markdown headers
    let formatted = content.replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-bold mb-2">$1</h3>');
    
    // Replace bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace list items
    formatted = formatted.replace(/• (.*?)(\n|$)/g, '<div class="flex items-start mb-1"><div class="mr-2 mt-1.5">•</div><div>$1</div></div>');
    
    // Replace line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };
  
  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Include all past messages for context
      const contextMessages = [
        ...messages.slice(-10),
        { role: 'user', content: messageText }
      ];
      
      // Call the chat API with dashboard data for personalized responses
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: contextMessages,
          dashboardData: dashboardData || null
        }),
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
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the Trovo Assistant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans flex flex-col items-end">
      {/* Chat window with enhanced animations */}
      <div 
        ref={chatWindowRef}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'bottom right',
          display: isOpen ? 'flex' : 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`bg-card mb-4 w-[350px] max-h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 zoom-in-95`}
      >
        {/* Header - Draggable */}
        <div className="bg-[#007bff] text-white p-4 flex justify-between items-center cursor-move chat-header select-none">
          <div className="flex items-center">
            <Bot size={18} className="mr-2 animate-pulse" />
            <h3 className="font-semibold">Trovo Assistant</h3>
          </div>
          <button 
            onClick={toggleChat} 
            className="text-white opacity-70 hover:opacity-100 transition-opacity hover:bg-white/20 h-6 w-6 rounded-full flex items-center justify-center"
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>
        
        {/* Messages with improved styling */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px] max-h-[350px] bg-background/50 backdrop-blur-sm">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`animate-in fade-in-50 duration-300 ${
                msg.role === 'user' 
                  ? 'slide-in-from-right-5' 
                  : 'slide-in-from-left-5'
              }`}
            >
              <div 
                className={`p-3 rounded-2xl max-w-[80%] shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-[#007bff] text-white ml-auto rounded-br-sm' 
                    : 'bg-muted text-muted-foreground mr-auto rounded-bl-sm border border-muted'
                }`}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content)
                }}
              />
              <div 
                className={`text-xs mt-1 text-muted-foreground ${
                  msg.role === 'user' ? 'text-right mr-1' : 'ml-1'
                }`}
              >
                {msg.role === 'user' ? 'You' : 'Trovo Assistant'}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="animate-in fade-in slide-in-from-left-5 mr-auto">
              <div className="flex items-center space-x-2 p-3 max-w-[80%] bg-muted rounded-2xl rounded-bl-sm shadow-md border border-muted">
                <div className="h-2 w-2 bg-[#007bff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-[#007bff] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="h-2 w-2 bg-[#007bff] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
              <div className="text-xs mt-1 ml-1 text-muted-foreground">
                Trovo Assistant is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions with improved styling */}
        <div className="p-3 border-t border-border flex flex-wrap gap-2 bg-background/80">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestion(suggestion)}
              className="bg-muted/80 text-muted-foreground text-xs py-1.5 px-3 rounded-full hover:bg-[#007bff]/10 hover:text-[#007bff] transition-colors border border-border hover:border-[#007bff]/30 flex items-center"
            >
              <Sparkles size={10} className="mr-1 text-[#007bff]" />
              {suggestion}
            </button>
          ))}
        </div>
        
        {/* Input with improved styling */}
        <div className="p-3 border-t border-border flex gap-2 bg-background">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-2 rounded-full bg-background border border-input focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff]"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-[#007bff] text-white p-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0069d9] transition-colors shadow-md"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      
      {/* Chat button with pulse animation */}
      <button
        ref={buttonRef}
        onClick={toggleChat}
        className={`w-14 h-14 bg-[#007bff] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#0069d9] transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 ${
          pulseAnimation ? 'animate-pulse' : ''
        }`}
        aria-label="Open chat assistant"
      >
        {pulseAnimation ? (
          <Bot size={24} className="animate-bounce" />
        ) : (
          <MessageSquare size={24} />
        )}
      </button>
    </div>
  );
}