# AI Menu Assistant - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + TailwindCSS)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User Query
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND COMPONENT                         │
│                    AIChatbot.jsx (React)                        │
│  • Chat UI                                                      │
│  • Message History                                              │
│  • Loading States                                               │
│  • Error Handling                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/ai/chat
                              │ {query, menu_data}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API                               │
│                   ai_routes.py (Flask)                          │
│  • Request Validation                                           │
│  • Prompt Construction                                          │
│  • Response Parsing                                             │
│  • Error Handling                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Call
                              │ {prompt + menu_data}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GOOGLE GEMINI AI                           │
│                    (gemini-pro model)                           │
│  • Natural Language Processing                                  │
│  • Data Filtering Logic                                         │
│  • Result Generation                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JSON Response
                              │ {results: [...]}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MENU FILTERING                             │
│                    Menu.jsx (React)                             │
│  • Display Filtered Items                                       │
│  • Update UI                                                    │
│  • Allow Clear Filters                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend Layer

#### AIChatbot.jsx
```
┌──────────────────────────────┐
│   Floating Chat Button       │
│   • Sparkles Icon            │
│   • "AI Menu Assistant"      │
└──────────────────────────────┘
              │
              ▼ (onClick)
┌──────────────────────────────┐
│      Chat Window             │
│  ┌────────────────────────┐  │
│  │ Header (Red)           │  │
│  ├────────────────────────┤  │
│  │ Message History        │  │
│  │ • AI Messages (Gray)   │  │
│  │ • User Messages (Red)  │  │
│  │ • Loading Indicator    │  │
│  ├────────────────────────┤  │
│  │ Input Box + Send       │  │
│  │ Clear Filters Link     │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Props:**
- `menuItems`: Array of all menu items
- `onFilterResults`: Callback to filter menu display

**State:**
- `isOpen`: Chat window visibility
- `query`: Current user input
- `messages`: Chat history
- `isLoading`: API call in progress

#### Menu.jsx Integration
```javascript
// State
const [aiFilteredItems, setAiFilteredItems] = useState(null);

// Handler
const handleAIFilter = (filteredResults) => {
  setAiFilteredItems(filteredResults);
};

// Filtering Logic
const filteredItems = (aiFilteredItems || menuItems).filter(item => {
  // Apply tag filters
});

// Component
<AIChatbot menuItems={menuItems} onFilterResults={handleAIFilter} />
```

### 2. Backend Layer

#### ai_routes.py
```python
@ai_bp.route('/chat', methods=['POST'])
def chat():
    # 1. Extract request data
    user_query = data.get('query')
    menu_data = data.get('menu_data')
    
    # 2. Validate inputs
    if not user_query or not menu_data:
        return error
    
    # 3. Create Gemini model
    model = genai.GenerativeModel('gemini-pro')
    
    # 4. Build prompt
    prompt = f"{SYSTEM_PROMPT}\n\nMenu Data: {menu_data}\n\nQuery: {user_query}"
    
    # 5. Generate response
    response = model.generate_content(prompt)
    
    # 6. Parse JSON
    result = json.loads(response.text)
    
    # 7. Return results
    return jsonify(result)
```

#### app.py Registration
```python
from routes.ai_routes import ai_bp
app.register_blueprint(ai_bp, url_prefix='/api/ai')
```

### 3. AI Layer

#### Gemini AI Processing
```
Input: System Prompt + Menu Data + User Query
         │
         ▼
    ┌─────────────────────┐
    │  Parse User Intent  │
    │  • Dietary?         │
    │  • Ingredient?      │
    │  • Allergen?        │
    └─────────────────────┘
         │
         ▼
    ┌─────────────────────┐
    │  Scan Menu Items    │
    │  • Check tags       │
    │  • Check names      │
    │  • Apply filters    │
    └─────────────────────┘
         │
         ▼
    ┌─────────────────────┐
    │  Generate Results   │
    │  • 5-10 items       │
    │  • With rationale   │
    │  • JSON format      │
    └─────────────────────┘
         │
         ▼
Output: {"results": [...]}
```

## Data Flow

### Request Flow
```
User Types "vegetarian"
    │
    ▼
AIChatbot.jsx
    │ setState(messages)
    ▼
fetch('/api/ai/chat', {
    query: "vegetarian",
    menu_data: [...]
})
    │
    ▼
Flask Backend (ai_routes.py)
    │ Validate
    ▼
genai.GenerativeModel('gemini-pro')
    │ generate_content(prompt)
    ▼
Gemini AI
    │ Process & Filter
    ▼
Return JSON Response
```

### Response Flow
```
Gemini AI Returns:
{
  "results": [
    {
      "name": "Cheese Pizza",
      "station": "Pizza",
      "location": "Worcester DC",
      "rationale": "Vegetarian tag"
    }
  ]
}
    │
    ▼
Flask Backend
    │ Parse JSON
    │ Validate structure
    ▼
Return to Frontend
    │
    ▼
AIChatbot.jsx
    │ Format message
    │ Update chat history
    ▼
Call onFilterResults([...])
    │
    ▼
Menu.jsx
    │ setAiFilteredItems([...])
    ▼
Re-render with filtered items
```

## File Structure

```
DormDash/
│
├── backend/
│   ├── routes/
│   │   ├── ai_routes.py          ← AI endpoint
│   │   ├── menu_routes.py
│   │   ├── order_routes.py
│   │   └── ...
│   ├── app.py                     ← Register AI blueprint
│   ├── requirements.txt           ← Add google-generativeai
│   └── .env                       ← GEMINI_API_KEY
│
├── frontend-new/
│   └── src/
│       ├── components/
│       │   └── AIChatbot.jsx      ← Chat component
│       └── pages/
│           └── Menu.jsx           ← Integrate chatbot
│
└── Documentation/
    ├── AI_QUICK_START.md
    ├── AI_CHATBOT_SETUP.md
    ├── AI_IMPLEMENTATION_SUMMARY.md
    ├── AI_SYSTEM_PROMPT.md
    └── AI_ARCHITECTURE.md         ← This file
```

## API Specification

### Endpoint: POST /api/ai/chat

#### Request
```json
{
  "query": "string (required)",
  "menu_data": "array (required)"
}
```

#### Response (Success)
```json
{
  "results": [
    {
      "name": "string",
      "station": "string",
      "location": "string",
      "rationale": "string"
    }
  ]
}
```

#### Response (Error)
```json
{
  "error": "string"
}
```

#### Status Codes
- `200`: Success
- `400`: Bad request (missing query or menu_data)
- `500`: Server error (API key not configured, Gemini error)

## Security Considerations

### API Key Protection
```
Environment Variable (Backend)
    ↓
.env file (gitignored)
    ↓
os.getenv('GEMINI_API_KEY')
    ↓
genai.configure(api_key=key)
```

### CORS Configuration
```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",  # Vite dev server
            "http://localhost:8080"   # Alternative
        ]
    }
})
```

### Input Validation
```python
# Backend validates:
✓ Query is not empty
✓ Menu data is provided
✓ API key is configured
✓ Response is valid JSON
```

## Performance Considerations

### Optimization Strategies
1. **Menu Data Size**: Send only necessary fields
2. **Result Limit**: Cap at 5-10 items
3. **Caching**: Could cache common queries
4. **Async Processing**: Non-blocking API calls
5. **Error Handling**: Graceful degradation

### Response Times
- **Frontend → Backend**: ~10ms (local)
- **Backend → Gemini**: ~1-3 seconds
- **Total**: ~1-3 seconds per query

## Scalability

### Current Limitations
- Single-threaded Flask server
- No query caching
- No rate limiting
- Synchronous API calls

### Future Improvements
- [ ] Add Redis caching for common queries
- [ ] Implement rate limiting per user
- [ ] Use async/await for Gemini calls
- [ ] Deploy with Gunicorn/uWSGI
- [ ] Add request queuing

## Monitoring & Debugging

### Backend Logs
```python
print(f"Error in AI chat: {e}")  # Error logging
```

### Frontend Console
```javascript
console.error('Error querying AI:', error);
```

### Debug Checklist
1. ✓ Backend server running?
2. ✓ API key configured?
3. ✓ CORS enabled?
4. ✓ Menu data loaded?
5. ✓ Network requests successful?
6. ✓ JSON parsing working?

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI components |
| Styling | TailwindCSS | Modern design |
| Icons | Lucide React | UI icons |
| Routing | React Router | Page navigation |
| Backend | Flask | API server |
| AI | Google Gemini Pro | NLP & filtering |
| Language | Python 3.x | Backend logic |
| Package Manager | pip / npm | Dependencies |

## Deployment Architecture

### Development
```
localhost:5173 (Frontend)
    ↓ HTTP
localhost:8080 (Backend)
    ↓ HTTPS
Gemini API (Google Cloud)
```

### Production (Future)
```
CDN (Frontend)
    ↓ HTTPS
Load Balancer
    ↓
Backend Servers (Multiple)
    ↓ HTTPS
Gemini API (Google Cloud)
```

## Conclusion

The AI Menu Assistant uses a clean, three-tier architecture:
1. **Frontend**: React-based chat interface
2. **Backend**: Flask API with Gemini integration
3. **AI**: Google Gemini Pro for NLP and filtering

This design ensures:
- ✅ Separation of concerns
- ✅ Easy maintenance
- ✅ Scalability
- ✅ Security
- ✅ User-friendly experience
