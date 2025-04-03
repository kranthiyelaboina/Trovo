import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import openAIService from '@/services/openai-service';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function CredAssistant() {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your Cred Assistant. How can I help you manage your credit card points today?', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [useAI, setUseAI] = useState(false);

  // Auto scroll to bottom of chat when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Check if API is initialized
  useEffect(() => {
    // Check if OpenAI is already initialized
    if (openAIService.isInitialized()) {
      setUseAI(true);
      return;
    }
    
    // Fallback to localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      const initialized = openAIService.initialize(savedApiKey);
      setUseAI(initialized);
    }
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const initialized = openAIService.initialize(apiKey);
      if (initialized) {
        localStorage.setItem('openai_api_key', apiKey);
        setUseAI(true);
        setShowApiKeyInput(false);
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been saved",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "Failed to initialize OpenAI with the provided key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize OpenAI service",
        variant: "destructive",
      });
    }
  };

  const getAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const response = await openAIService.getChatCompletion(userMessage);
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to simulated response
      let responseText = "I'm sorry, I'm having trouble connecting to my AI services. Let me provide some basic information:";
      
      if (userMessage.toLowerCase().includes('point') || userMessage.toLowerCase().includes('points')) {
        responseText += ' Your points are a valuable asset! You can redeem them for various rewards or use them to make payments.';
      } else if (userMessage.toLowerCase().includes('redeem')) {
        responseText += ' To redeem your points, go to the Redemption section, select a card, and choose from the available options.';
      } else if (userMessage.toLowerCase().includes('card')) {
        responseText += ' You can manage your cards in the Cards section.';
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responseText, timestamp: new Date() }
      ]);

      // Disable AI mode if there was an error
      setUseAI(false);
      toast({
        title: "AI Service Error",
        description: "Could not connect to OpenAI. Switched to basic assistant mode.",
        variant: "destructive",
      });
    }
    
    setIsTyping(false);
  };

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      let responseText = '';
      
      // Simple response logic based on keywords
      if (userMessage.toLowerCase().includes('point') || userMessage.toLowerCase().includes('points')) {
        responseText = 'Your points are a valuable asset! You can redeem them for various rewards or use them to make payments. Would you like to know more about maximizing your points value?';
      } else if (userMessage.toLowerCase().includes('redeem') || userMessage.toLowerCase().includes('redemption')) {
        responseText = 'To redeem your points, go to the Redemption tab, select a card, and choose from the available redemption options. Each option has a different conversion rate.';
      } else if (userMessage.toLowerCase().includes('card') || userMessage.toLowerCase().includes('cards')) {
        responseText = 'You can manage your cards in the Cards section. Add new cards, view your existing cards, and track points for each card.';
      } else if (userMessage.toLowerCase().includes('payment') || userMessage.toLowerCase().includes('pay')) {
        responseText = 'You can make UPI payments in the Payments section. You have options to pay using your card or redeem your points for payments.';
      } else if (userMessage.toLowerCase().includes('expire') || userMessage.toLowerCase().includes('expiry')) {
        responseText = 'Points expiry depends on your card\'s terms. Check the dashboard for any expiring points. I recommend using expiring points first!';
      } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        responseText = 'Hello! How can I assist you with your credit card points today?';
      } else if (userMessage.toLowerCase().includes('thank')) {
        responseText = 'You\'re welcome! Feel free to ask if you need any further assistance.';
      } else {
        responseText = 'I\'m here to help with all things related to your credit card points! You can ask about redeeming points, making payments, checking card balances, or understanding point expiry.';
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responseText, timestamp: new Date() }
      ]);
      
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message immediately
    setMessages(prev => [
      ...prev,
      { role: 'user', content: inputValue, timestamp: new Date() }
    ]);
    
    const userMessage = inputValue;
    setInputValue('');
    
    // Process response
    if (useAI) {
      getAIResponse(userMessage);
    } else {
      simulateResponse(userMessage);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] shadow-lg flex flex-col">
          <CardHeader className="py-3 px-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground">CA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Cred Assistant</CardTitle>
                {useAI && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    AI Mode
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="h-8 w-8"
                title="AI Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggle}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {showApiKeyInput ? (
            <div className="p-4 border-b">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">OpenAI API Key</h3>
                <p className="text-xs text-muted-foreground">Enter your OpenAI API key to enable AI-powered responses.</p>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="sk-..."
                  className="text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowApiKeyInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSaveApiKey}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full">
              <Input
                type="text"
                placeholder="Type your question..."
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 mr-2"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={handleToggle}
          className="h-14 w-14 rounded-full shadow-lg"
          variant="default"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}