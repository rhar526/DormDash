from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

ai_bp = Blueprint('ai', __name__)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# System prompt for the AI agent
SYSTEM_PROMPT = """You are a strict data-filtering AI. Your only purpose is to analyze a provided JSON object of menu data from the UMass Worcester Dining Commons and return a list of items that match the user's specific query. You are not a recommender; you are a data-filter.

Your Inputs:
1. Verified Menu Data: The complete, raw JSON data for today's menu
2. User Query: A text string (e.g., "vegetarian," "low in calories," "no nuts")

Your Step-by-Step Process:
1. Initial Scan: Read through the entire JSON data provided
2. Apply Critical Filters: For every food item, check:
   - Is it being served? (This data doesn't have a "published" flag, so assume all items are available)
3. Interpret the Query:
   - If "vegetarian" or "vegan" or "plant based": check the "tags" array for those terms
   - If "with chicken" or "beef": search within the "item_name" field
   - If "no nuts": exclude items with nuts mentioned in the item_name
   - For other dietary preferences: check the "tags" array
4. Construct Response: For each matching item, create an entry with:
   - name: exact item_name from data
   - station: exact category from data
   - location: exact location from data
   - rationale: brief explanation of why it matches

Final Output:
- Return a JSON object with a "results" array containing 5-10 matching items
- If no matches found, return empty array
- Never invent results
- Format: {"results": [{"name": "...", "station": "...", "location": "...", "rationale": "..."}]}

IMPORTANT: Only return valid JSON. Do not include any explanatory text before or after the JSON."""

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Handle AI chatbot queries for menu filtering"""
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        menu_data = data.get('menu_data', [])
        
        if not user_query:
            return jsonify({'error': 'Query is required'}), 400
        
        if not menu_data:
            return jsonify({'error': 'Menu data is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({'error': 'Gemini API key not configured'}), 500
        
        # Create the model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Prepare the prompt with menu data and user query
        prompt = f"""{SYSTEM_PROMPT}

Menu Data (JSON):
{json.dumps(menu_data, indent=2)}

User Query: {user_query}

Analyze the menu data and return matching items in the specified JSON format."""
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Parse the AI response
        ai_response = response.text.strip()
        
        # Try to extract JSON from the response
        try:
            # Remove markdown code blocks if present
            if '```json' in ai_response:
                ai_response = ai_response.split('```json')[1].split('```')[0].strip()
            elif '```' in ai_response:
                ai_response = ai_response.split('```')[1].split('```')[0].strip()
            
            result = json.loads(ai_response)
            
            # Ensure the result has the expected structure
            if 'results' not in result:
                result = {'results': []}
            
            return jsonify(result), 200
            
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw response
            return jsonify({
                'results': [],
                'raw_response': ai_response,
                'error': 'Failed to parse AI response as JSON'
            }), 200
        
    except Exception as e:
        print(f"Error in AI chat: {e}")
        return jsonify({'error': str(e)}), 500
