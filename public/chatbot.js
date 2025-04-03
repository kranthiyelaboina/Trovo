// CredPal Assistant Chatbot

document.addEventListener('DOMContentLoaded', function() {
  // Create chatbot DOM elements
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-container';
  
  // Create toggle button
  const chatbotButton = document.createElement('button');
  chatbotButton.className = 'chatbot-button';
  chatbotButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8.2v-.8a2.4 2.4 0 0 0-4.8 0v.8"></path><path d="M7 11h10v.01"></path></svg>';
  chatbotContainer.appendChild(chatbotButton);
  
  // Create chat window
  const chatbotWindow = document.createElement('div');
  chatbotWindow.className = 'chatbot-window';
  
  // Window header
  const chatbotHeader = document.createElement('div');
  chatbotHeader.className = 'chatbot-header';
  chatbotHeader.innerHTML = 'CredPal Assistant <button class="chatbot-close">&times;</button>';
  chatbotWindow.appendChild(chatbotHeader);
  
  // Messages area
  const chatbotMessages = document.createElement('div');
  chatbotMessages.className = 'chatbot-messages';
  chatbotWindow.appendChild(chatbotMessages);
  
  // Loading indicator
  const chatbotLoading = document.createElement('div');
  chatbotLoading.className = 'chatbot-loading';
  chatbotLoading.style.display = 'none';
  chatbotLoading.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  chatbotWindow.appendChild(chatbotLoading);
  
  // Suggestions
  const chatbotSuggestions = document.createElement('div');
  chatbotSuggestions.className = 'chatbot-suggestions';
  
  // Add suggestion chips
  const suggestions = [
    'Best redemption options',
    'Value of my points',
    'Expiring points',
    'Card recommendations',
    'Payment help'
  ];
  
  suggestions.forEach(suggestion => {
    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';
    chip.textContent = suggestion;
    chip.addEventListener('click', () => {
      document.querySelector('.chatbot-input input').value = suggestion;
      sendMessage(suggestion);
    });
    chatbotSuggestions.appendChild(chip);
  });
  
  chatbotWindow.appendChild(chatbotSuggestions);
  
  // Input area
  const chatbotInput = document.createElement('div');
  chatbotInput.className = 'chatbot-input';
  chatbotInput.innerHTML = `
    <input type="text" placeholder="Type your question here...">
    <button>Send</button>
  `;
  chatbotWindow.appendChild(chatbotInput);
  
  // Add the chat window to the container
  chatbotContainer.appendChild(chatbotWindow);
  
  // Add the container to the document
  document.body.appendChild(chatbotContainer);
  
  // Track chat state
  let isChatOpen = false;
  let messageHistory = [];
  let isWaitingForResponse = false;
  
  // Add welcome message
  function addWelcomeMessage() {
    const welcomeMessage = "👋 Hello! I'm your CredPal Assistant. How can I help you with your credit card points today?";
    addMessage(welcomeMessage, false);
  }
  
  // Toggle chat window
  function toggleChat() {
    isChatOpen = !isChatOpen;
    chatbotWindow.classList.toggle('open', isChatOpen);
    
    if (isChatOpen && chatbotMessages.children.length === 0) {
      addWelcomeMessage();
    }
  }
  
  // Add message to the chat
  function addMessage(text, isUser) {
    const message = document.createElement('div');
    message.className = isUser ? 'message user' : 'message bot';
    message.textContent = text;
    chatbotMessages.appendChild(message);
    
    // Save message in history
    messageHistory.push({
      role: isUser ? 'user' : 'assistant',
      content: text
    });
    
    // Scroll to bottom
    scrollToBottom();
  }
  
  // Show loading indicator
  function showLoading() {
    chatbotLoading.style.display = 'flex';
    scrollToBottom();
    isWaitingForResponse = true;
  }
  
  // Hide loading indicator
  function hideLoading() {
    chatbotLoading.style.display = 'none';
    isWaitingForResponse = false;
  }
  
  // Scroll chat to bottom
  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  // Send message to API and get response
  async function sendToAPI(messages) {
    try {
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling chat API:', error);
      return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  }
  
  // Handle sending a message
  async function sendMessage(text) {
    if (isWaitingForResponse) return;
    
    // Don't send empty messages
    if (!text.trim()) return;
    
    // Add user message to chat
    addMessage(text, true);
    
    // Clear input
    const inputField = document.querySelector('.chatbot-input input');
    if (inputField) {
      inputField.value = '';
    }
    
    // Show loading indicator
    showLoading();
    
    // Prepare context messages - include only last 10 for context window limitations
    const contextMessages = [
      {
        role: "system",
        content: "You are CredPal Assistant, an AI helper for CredPal, a credit card points management platform. Be friendly, helpful, and concise. Provide information about how to maximize credit card points value, redemption options, card management, and general advice about the platform. If you don't know something specific about a user's account, guide them to the relevant section of the app."
      },
      ...messageHistory.slice(-10)
    ];
    
    // Get AI response
    const response = await sendToAPI(contextMessages);
    
    // Hide loading indicator
    hideLoading();
    
    // Add bot response to chat
    addMessage(response, false);
  }
  
  // Event listeners
  chatbotButton.addEventListener('click', toggleChat);
  
  document.querySelector('.chatbot-close').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat();
  });
  
  const sendButton = document.querySelector('.chatbot-input button');
  const inputField = document.querySelector('.chatbot-input input');
  
  sendButton.addEventListener('click', () => {
    sendMessage(inputField.value);
  });
  
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(inputField.value);
    }
  });
});