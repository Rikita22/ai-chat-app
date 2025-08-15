const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ✅ Setup OpenAI client to use Hugging Face Router
const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HUGGINGFACE_API_KEY, // Replace for local test
});

// ✅ Model you want to use
const MODEL = 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai';

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });
    const reply = chatCompletion.choices[0]?.message?.content || 'No response from model';
    res.json({ reply });
  } catch (error) {
    console.error('Hugging Face Router error:', error.message, error.response?.data);
    res.status(500).send('Error communicating with Hugging Face router');
  }
});

module.exports = router;
