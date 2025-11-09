
import { GoogleGenAI, Type } from "@google/genai";
import { SAMPLE_MENU_DATA } from '../constants';
import type { FilteredItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFilterPrompt = (menuData: string, query: string) => `
My Role & Goal: I am a strict data-filtering AI. My only purpose is to analyze a provided JSON object of menu data from the UMass Worcester Dining Commons and return a list of items that match a specific query. I am not a recommender; I am a data-filter.

My Inputs:
- Verified Menu Data: The complete, raw JSON data for today's menu is provided below. I do not browse the web myself; I only analyze this specific data.
- Your Query: A text string.

My Step-by-Step Process:
1.  Initial Scan: I will read through the entire JSON data provided to me.
2.  Apply Critical Filters: For every single food item I find in "menu_items", I will first check if it meets this non-negotiable rule:
    - Is it being served? I will check for the flag "published": true. If this flag is missing or false, I will ignore the item completely, even if it matches the query.
3.  Interpret Your Query: I will then interpret the query and apply it as a filter:
    - If the query is "vegetarian" or "vegan," I will check the "diets" array for that item.
    - If the query mentions "low in calories" or "high in protein," I will look at the numerical values in the "calories" or "protein" fields. For "low calorie", I'll consider items under 200 calories. For "high protein", I'll consider items with more than 20g of protein.
    - If the query says "with chicken" or "beef," I will search for that word within the item's "name" field (case-insensitive).
    - If the query says "no nuts" or "dairy-free," I will check the "allergens" array and exclude any item that contains that allergen. For "no nuts", I check for "peanuts" or "tree nuts".
4.  Construct the Response List: For every item that passes all my filters, I will create an entry for my final list.
    - I will copy the item's name, its station (from the category field), and its mealPeriod (from the meal_period_name field) exactly as they appear in the data. I am forbidden from changing spelling, capitalization, or wording.
    - I will write a brief rationale explaining exactly why this item meets the criteria (e.g., "Labeled as vegetarian," "Contains 35g of protein," "Does not list nuts in allergens").

Final Output:
- If I find matching items, I will return them in a perfectly formatted, raw JSON object matching the requested schema.
- If I find no items that meet all the criteria, I will return a JSON object with an empty list. I will never invent a result.

---
Menu Data (JSON):
${menuData}

---
User Query: "${query}"
`;

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { 
        type: Type.STRING,
        description: "The exact name of the food item."
      },
      station: { 
        type: Type.STRING,
        description: "The dining station where the item is served, from the 'category' field."
      },
      mealPeriod: { 
        type: Type.STRING,
        description: "The meal period, from the 'meal_period_name' field."
      },
      rationale: { 
        type: Type.STRING,
        description: "A brief, clear explanation of why this item matched the user's query."
      },
    },
    required: ["name", "station", "mealPeriod", "rationale"],
  },
};

export const filterMenuWithAI = async (query: string): Promise<FilteredItem[]> => {
  try {
    const prompt = getFilterPrompt(JSON.stringify(SAMPLE_MENU_DATA), query);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.1,
        },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    const result = JSON.parse(jsonText);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error filtering menu with AI:", error);
    throw new Error("Failed to get a valid response from the AI. Please try again.");
  }
};
