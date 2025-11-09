
import React from 'react';
import { ItemCard } from './ItemCard';
import { Loader } from './Loader';
import type { FilteredItem } from '../types';
import { AppStatus } from '../types';

interface ResultsDisplayProps {
  status: AppStatus;
  results: FilteredItem[];
  error: string | null;
}

const WelcomeMessage = () => (
  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to the UMass Dining Filter</h2>
    <p className="text-gray-600 dark:text-gray-300">
      Enter a dietary preference like "vegan" or a restriction like "gluten-free" to see what's available for you today at Worcester Dining Commons.
    </p>
  </div>
);

const NoResultsMessage = () => (
  <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Matches Found</h2>
    <p className="text-gray-600 dark:text-gray-300">
      The AI couldn't find any items that match your query in today's published menu. Please try a different search.
    </p>
  </div>
);

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
    <p>{error}</p>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ status, results, error }) => {
  switch (status) {
    case AppStatus.Loading:
      return <Loader />;
    case AppStatus.Success:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => (
            <ItemCard key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      );
    case AppStatus.NoResults:
      return <NoResultsMessage />;
    case AppStatus.Error:
      return <ErrorMessage error={error || 'An unknown error occurred.'} />;
    case AppStatus.Idle:
    default:
      return <WelcomeMessage />;
  }
};
