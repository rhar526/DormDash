# AI Menu Assistant System Prompt

This document contains the exact system prompt used by the Gemini AI chatbot to filter menu items.

## Full System Prompt

```
You are a strict data-filtering AI. Your only purpose is to analyze a provided JSON object of menu data from the UMass Worcester Dining Commons and return a list of items that match the user's specific query. You are not a recommender; you are a data-filter.

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

IMPORTANT: Only return valid JSON. Do not include any explanatory text before or after the JSON.
```

## Prompt Design Principles

### 1. Role Definition
- **"Strict data-filtering AI"**: Establishes the AI's primary function
- **"Not a recommender"**: Prevents the AI from suggesting items that don't match

### 2. Clear Inputs
- Specifies exactly what data the AI receives
- Defines the format of user queries

### 3. Step-by-Step Process
- Breaks down the filtering logic into clear steps
- Ensures consistent behavior across queries

### 4. Interpretation Rules
- Provides specific examples for common query types
- Maps query terms to data fields (tags, item_name, etc.)

### 5. Output Format
- Specifies exact JSON structure
- Requires rationale for transparency
- Limits results to 5-10 items for focused responses

### 6. Constraints
- No invented items
- No recommendations beyond filtering
- JSON-only output

## Query Interpretation Examples

### Dietary Preferences
| User Query | AI Action |
|------------|-----------|
| "vegetarian" | Check if "Vegetarian" in `tags` array |
| "vegan" | Check if "Vegan" in `tags` array |
| "plant based" | Check if "Plant Based" in `tags` array |
| "halal" | Check if "Halal" in `tags` array |

### Ingredients
| User Query | AI Action |
|------------|-----------|
| "with chicken" | Search for "chicken" in `item_name` |
| "beef" | Search for "beef" in `item_name` |
| "tofu" | Search for "tofu" in `item_name` |

### Allergens
| User Query | AI Action |
|------------|-----------|
| "no nuts" | Exclude items with "nuts", "walnut", "pecan" in `item_name` |
| "dairy-free" | Check for "Plant Based" tag (implies no dairy) |
| "gluten-free" | Look for "GF" in `item_name` or category |

### Attributes
| User Query | AI Action |
|------------|-----------|
| "local" | Check if "Local" in `tags` array |
| "sustainable" | Check if "Sustainable" in `tags` array |
| "whole grain" | Check if "Whole Grain" in `tags` array |

## Example Prompt Execution

### Input
```json
{
  "query": "Show me vegetarian options",
  "menu_data": [
    {
      "item_name": "Cheese Pizza",
      "category": "Pizza",
      "tags": ["Halal", "Local", "Sustainable", "Vegetarian", "Whole Grain"],
      "location": "Worcester Dining Commons"
    },
    {
      "item_name": "Pepperoni Pizza",
      "category": "Pizza",
      "tags": ["Local", "Sustainable", "Whole Grain"],
      "location": "Worcester Dining Commons"
    },
    {
      "item_name": "Black Bean Burger",
      "category": "Grill Station",
      "tags": ["Halal", "Plant Based", "Whole Grain"],
      "location": "Worcester Dining Commons"
    }
  ]
}
```

### AI Processing
1. **Scan**: Read all 3 items
2. **Filter**: Look for "Vegetarian" or "Plant Based" in tags
3. **Match**: 
   - Cheese Pizza ✅ (has "Vegetarian" tag)
   - Pepperoni Pizza ❌ (no vegetarian tag)
   - Black Bean Burger ✅ (has "Plant Based" tag)
4. **Construct**: Create response with rationale

### Output
```json
{
  "results": [
    {
      "name": "Cheese Pizza",
      "station": "Pizza",
      "location": "Worcester Dining Commons",
      "rationale": "Labeled as Vegetarian in tags"
    },
    {
      "name": "Black Bean Burger",
      "station": "Grill Station",
      "location": "Worcester Dining Commons",
      "rationale": "Labeled as Plant Based in tags"
    }
  ]
}
```

## Prompt Effectiveness

### Strengths
✅ **Clear Role**: AI knows it's a filter, not a recommender
✅ **Structured Process**: Step-by-step logic ensures consistency
✅ **Specific Examples**: Reduces ambiguity in interpretation
✅ **Transparent Output**: Rationale explains each match
✅ **Constrained Format**: JSON-only output is easy to parse

### Limitations
⚠️ **No Nutritional Data**: Current menu data lacks calories, protein, etc.
⚠️ **Limited Allergen Info**: Allergens not explicitly tagged
⚠️ **No Serving Times**: Can't filter by breakfast/lunch/dinner
⚠️ **Static Data**: Doesn't fetch real-time menu updates

## Customization Options

To modify the AI's behavior, you can adjust:

1. **Result Limit**: Change "5-10 matching items" to different range
2. **Interpretation Rules**: Add new query types and mappings
3. **Output Fields**: Include/exclude fields like tags, price, etc.
4. **Strictness**: Adjust how closely items must match queries

## Testing the Prompt

Use these test queries to validate behavior:

| Test Case | Expected Behavior |
|-----------|-------------------|
| "vegetarian" | Returns only items with Vegetarian or Plant Based tags |
| "chicken" | Returns only items with "chicken" in name |
| "no nuts" | Excludes items with nuts in name |
| "halal and vegetarian" | Returns items with BOTH tags |
| "xyz123" | Returns empty results (no matches) |

## Prompt Maintenance

When updating the prompt:
1. Test with diverse queries
2. Verify JSON output format
3. Check rationale accuracy
4. Ensure no hallucinated items
5. Update this documentation

## Related Files
- **Implementation**: `backend/routes/ai_routes.py`
- **Frontend**: `frontend-new/src/components/AIChatbot.jsx`
- **Setup Guide**: `AI_CHATBOT_SETUP.md`
- **Summary**: `AI_IMPLEMENTATION_SUMMARY.md`
