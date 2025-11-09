
import React, { useState, useCallback } from 'react';
import { QueryInput } from './components/QueryInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { filterMenuWithAI } from './services/geminiService';
import type { FilteredItem } from './types';
import { AppStatus } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<FilteredItem[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.Idle);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = useCallback(async (query: string) => {
    setStatus(AppStatus.Loading);
    setError(null);
    setResults([]);

    try {
      const filteredItems = await filterMenuWithAI(query);
      if (filteredItems.length > 0) {
        setResults(filteredItems);
        setStatus(AppStatus.Success);
      } else {
        setStatus(AppStatus.NoResults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(AppStatus.Error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div 
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/1600/400?grayscale&blur=2')" }}
      >
        <div className="bg-black bg-opacity-50 py-16 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">UMass Worcester Dining Filter</h1>
            <p className="mt-4 text-lg text-gray-200">AI-Powered Menu Analysis</p>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        <div className="sticky top-4 z-10 py-4 mb-8">
            <QueryInput onSubmit={handleQuerySubmit} isLoading={status === AppStatus.Loading} />
        </div>
        
        <div className="max-w-7xl mx-auto">
            <ResultsDisplay status={status} results={results} error={error} />
        </div>
      </main>

      <footer className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} UMass Dining Filter. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
