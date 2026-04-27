const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate quiz
router.post('/generate-quiz', auth, async (req, res) => {
  try {
    const { lessonContent, numQuestions = 5 } = req.body;

    const prompt = `Generate ${numQuestions} MCQ questions from this lesson content.
Return ONLY valid JSON array, no explanation, no markdown:
[{ "question": "Q?", "options": ["A", "B", "C", "D"], "answer": "A" }]

Lesson content: ${lessonContent}`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    let text = response.choices[0].message.content.trim();
    if (text.startsWith('```')) {
      text = text.split('```')[1].replace('json', '').trim();
    }
    const quiz = JSON.parse(text);
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course recommendations
router.post('/recommendations', auth, async (req, res) => {
  try {
    const { enrolledCategories, interests } = req.body;

    const prompt = `Based on these enrolled course categories: ${enrolledCategories.join(', ')}
And interests: ${interests}
Suggest 3 course topics to learn next.
Return ONLY valid JSON array:
[{ "title": "Course Title", "category": "Category", "reason": "Why learn this" }]`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    let text = response.choices[0].message.content.trim();
    if (text.startsWith('```')) {
      text = text.split('```')[1].replace('json', '').trim();
    }
    const recommendations = JSON.parse(text);
    res.json({ success: true, recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;