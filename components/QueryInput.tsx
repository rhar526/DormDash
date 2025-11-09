
import React, { useState } from 'react';
import { FilterIcon } from './icons/FilterIcon';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'vegetarian', 'high in protein', or 'no nuts'"
          className="w-full px-6 py-4 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-red-800 hover:bg-red-700 text-white font-bold p-4 rounded-full m-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FilterIcon className="w-6 h-6"/>
          )}
        </button>
      </div>
    </form>
  );
};
