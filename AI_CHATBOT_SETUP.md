# AI Menu Assistant Chatbot Setup

## Overview
The AI Menu Assistant is a Gemini-powered chatbot that helps users filter menu items based on natural language queries. It follows strict data-filtering rules and only returns items that match the user's specific dietary preferences.

## Features
- **Natural Language Queries**: Ask questions like "Show me vegetarian options" or "What has chicken?"
- **Strict Data Filtering**: Only returns items that actually match your criteria
- **Dietary Preferences**: Supports vegetarian, vegan, plant-based, halal, allergen-free, and more
- **Interactive Chat Interface**: Floating chat button with conversation history
- **Menu Integration**: Automatically filters the menu display based on AI results

## Setup Instructions

### 1. Get a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Install the required Python package:
   ```bash
   pip install google-generativeai
   ```
   Or install all requirements:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Start the Backend Server
```bash
python app.py
```
The server will run on `http://localhost:8080`

### 4. Start the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend-new
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## How to Use

### Accessing the Chatbot
1. Navigate to the Menu page
2. Look for the floating "AI Menu Assistant" button in the bottom-right corner
3. Click to open the chat interface

### Example Queries
- **Dietary Preferences**: "Show me vegetarian options", "Find vegan meals", "What's plant-based?"
- **Ingredients**: "What has chicken?", "Show me items with beef", "Find tofu dishes"
- **Allergens**: "No nuts", "Dairy-free options", "Avoid shellfish"
- **Combinations**: "Vegetarian items without dairy", "Plant-based high protein meals"

### How It Works
1. You type a natural language query
2. The chatbot sends your query + the current menu data to the Gemini AI
3. Gemini analyzes the menu and returns matching items with explanations
4. The results are displayed in the chat and optionally filter the menu display
5. You can click "Clear AI filters" to reset the menu view

## AI Behavior

The AI follows strict rules:
- **Data-Only Filtering**: Only analyzes the provided menu data, never invents items
- **Exact Matching**: Returns items that genuinely match your criteria
- **Transparent Rationale**: Explains why each item matches your query
- **No Recommendations**: Acts as a filter, not a recommender
- **5-10 Results**: Returns a focused list of matching items

## Troubleshooting

### "Gemini API key not configured" Error
- Make sure you've added `GEMINI_API_KEY` to your `.env` file
- Restart the backend server after adding the key

### "Failed to parse AI response" Error
- The AI occasionally returns non-JSON responses
- Try rephrasing your query to be more specific
- Check the backend logs for the raw response

### No Results Found
- Try broader queries (e.g., "vegetarian" instead of "vegan vegetarian gluten-free")
- Check if the menu data is loaded correctly
- Verify the menu has items matching your criteria

### Backend Connection Error
- Ensure the backend server is running on port 8080
- Check CORS settings in `app.py` if using a different port
- Verify the API endpoint URL in `AIChatbot.jsx`

## Technical Details

### Backend API Endpoint
- **URL**: `POST /api/ai/chat`
- **Request Body**:
  ```json
  {
    "query": "Show me vegetarian options",
    "menu_data": [/* array of menu items */]
  }
  ```
- **Response**:
  ```json
  {
    "results": [
      {
        "name": "Item Name",
        "station": "Category",
        "location": "Dining Hall",
        "rationale": "Why it matches"
      }
    ]
  }
  ```

### Frontend Component
- **Location**: `frontend-new/src/components/AIChatbot.jsx`
- **Props**:
  - `menuItems`: Array of menu items to analyze
  - `onFilterResults`: Callback function to filter the menu display

### AI Model
- **Model**: `gemini-pro`
- **Provider**: Google Generative AI
- **Purpose**: Natural language understanding and data filtering

## Future Enhancements
- [ ] Add conversation memory for follow-up questions
- [ ] Support for nutritional information queries
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Save favorite queries
- [ ] Export filtered results

## Support
For issues or questions, please check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. Gemini API quota and rate limits
4. Network connectivity between frontend and backend
