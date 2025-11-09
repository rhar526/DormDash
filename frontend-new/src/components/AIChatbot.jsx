import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

const AIChatbot = ({ menuItems, onFilterResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help you find menu items based on your dietary preferences. Try asking me things like:\n\n• "Show me vegetarian options"\n• "What has chicken?"\n• "Find items without nuts"\n• "Show me plant-based meals"'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          menu_data: menuItems
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${errorData.error || 'Failed to connect to AI service'}`
        }]);
        return;
      }

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.error}`
        }]);
      } else if (data.results && data.results.length > 0) {
        // Format the results as a message
        let resultMessage = `I found ${data.results.length} items matching your query:\n\n`;
        
        data.results.forEach((item, idx) => {
          resultMessage += `${idx + 1}. **${item.name}**\n`;
          resultMessage += `   📍 ${item.station} - ${item.location}\n`;
          resultMessage += `   ✓ ${item.rationale}\n\n`;
        });

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: resultMessage,
          results: data.results
        }]);

        // Optionally filter the menu to show only these items
        if (onFilterResults) {
          const filteredItems = menuItems.filter(item =>
            data.results.some(result => 
              result.name.toLowerCase() === item.item_name.toLowerCase()
            )
          );
          onFilterResults(filteredItems);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I couldn\'t find any items matching your query. Try rephrasing or asking about different dietary preferences.'
        }]);
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running and try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    if (onFilterResults) {
      onFilterResults(null);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-dormdash-red text-white p-4 rounded-full shadow-lg hover:bg-red-900 transition-all z-50 flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6" />
          <span className="font-medium">AI Menu Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-dormdash-red text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">AI Menu Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-900 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-dormdash-red text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing menu...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about menu items..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dormdash-red"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-dormdash-red text-white p-2 rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {onFilterResults && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear AI filters
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
