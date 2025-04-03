import { Router } from 'express';
// @ts-ignore
import fetch from 'node-fetch';

const router = Router();

// API configuration
const API_KEY = process.env.CREDPAL_API_KEY;
const API_URL = 'https://api.aimlapi.com/v1/chat/completions';

// Handle chat completions
router.post('/completions', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'o1',
        messages: messages
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI service',
        details: errorData
      });
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;