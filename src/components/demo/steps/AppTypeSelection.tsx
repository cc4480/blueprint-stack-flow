
import React from 'react';
import { APP_TYPES } from '../constants';

interface AppTypeSelectionProps {
  onSelect: (appType: string) => void;
}

const AppTypeSelection: React.FC<AppTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {APP_TYPES.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.label)}
          className="p-6 border-2 border-gray-700 rounded-xl hover:border-purple-400 hover:bg-gray-800 transition-all duration-300 text-center group bg-gray-800"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {type.icon}
          </div>
          <div className="font-semibold text-gray-100 mb-2">{type.label}</div>
          <div className="text-sm text-gray-400">{type.description}</div>
        </button>
      ))}
    </div>
  );
};

export default AppTypeSelection;
