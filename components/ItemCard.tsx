
import React from 'react';
import type { FilteredItem } from '../types';

interface ItemCardProps {
  item: FilteredItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white pr-4">{item.name}</h3>
            <span className="flex-shrink-0 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">{item.mealPeriod}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">{item.station}</p>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-800 dark:text-gray-100">Rationale:</span> {item.rationale}
            </p>
        </div>
      </div>
    </div>
  );
};
