# AI Menu Assistant - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get Your API Key (2 minutes)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and click "Create API Key"
3. Copy the key

### Step 2: Configure Backend (1 minute)
```bash
cd backend
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here
pip install -r requirements.txt
python app.py
```

### Step 3: Start Frontend (1 minute)
```bash
cd frontend-new
npm install
npm run dev
```

**Done!** Visit http://localhost:5173 and click the Menu page.

---

## 💬 How to Use

1. **Find the Button**: Look for "AI Menu Assistant" (bottom-right corner)
2. **Click to Open**: Chat window appears
3. **Type Your Query**: Ask about menu items
4. **Get Results**: AI shows matching items with explanations

---

## 🎯 Example Queries

### Dietary Preferences
```
Show me vegetarian options
Find vegan meals
What's plant-based?
Halal food only
```

### Ingredients
```
What has chicken?
Show me beef items
Find tofu dishes
Items with rice
```

### Allergens
```
No nuts
Dairy-free options
Avoid shellfish
Gluten-free meals
```

### Combinations
```
Vegetarian without dairy
Plant-based high protein
Local and sustainable options
Halal vegetarian meals
```

---

## ✨ Features

- 🤖 **Smart Filtering**: AI understands natural language
- 📊 **Accurate Results**: Only shows items that match
- 💡 **Transparent**: Explains why each item matches
- 🎨 **Beautiful UI**: Modern chat interface
- ⚡ **Fast**: Results in seconds
- 🔄 **Flexible**: Clear filters anytime

---

## 🐛 Common Issues

### "API key not configured"
**Fix**: Add `GEMINI_API_KEY` to `.env` and restart backend

### "Connection error"
**Fix**: Make sure backend is running on port 8080

### "No results found"
**Fix**: Try broader queries like "vegetarian" instead of specific combinations

---

## 📱 UI Overview

```
┌─────────────────────────────────────┐
│  🌟 AI Menu Assistant          ✕   │  ← Header
├─────────────────────────────────────┤
│                                     │
│  Hi! I can help you find menu...   │  ← AI Message
│                                     │
│              Show me vegetarian  ●  │  ← Your Message
│                                     │
│  I found 8 items matching...        │  ← AI Response
│  1. Cheese Pizza                    │
│     📍 Pizza - Worcester DC         │
│     ✓ Labeled as Vegetarian         │
│                                     │
├─────────────────────────────────────┤
│  [Type your query...]        [→]   │  ← Input
│  Clear AI filters                   │
└─────────────────────────────────────┘
```

---

## 🎓 Tips for Best Results

1. **Be Specific**: "vegetarian" works better than "healthy food"
2. **Use Keywords**: "chicken", "plant-based", "no nuts"
3. **One Topic**: Ask about one thing at a time
4. **Clear Filters**: Reset between different queries
5. **Try Variations**: If no results, rephrase your query

---

## 📚 More Information

- **Full Setup Guide**: `AI_CHATBOT_SETUP.md`
- **Implementation Details**: `AI_IMPLEMENTATION_SUMMARY.md`
- **System Prompt**: `AI_SYSTEM_PROMPT.md`

---

## 🎉 You're Ready!

The AI Menu Assistant is now set up and ready to help you find the perfect meal at UMass Worcester Dining Commons!

**Questions?** Check the troubleshooting section in `AI_CHATBOT_SETUP.md`
