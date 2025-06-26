
import React from 'react';
import { DATA_SOURCES } from '../constants';

interface DataSourceSelectionProps {
  selectedAppType: string;
  onSelect: (dataSource: string) => void;
}

const DataSourceSelection: React.FC<DataSourceSelectionProps> = ({ selectedAppType, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-300">
          Building: <span className="font-semibold text-purple-400">{selectedAppType}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DATA_SOURCES.map(source => (
          <button
            key={source.id}
            onClick={() => onSelect(source.label)}
            className="p-6 border-2 border-gray-700 rounded-xl hover:border-purple-400 hover:bg-gray-800 transition-all duration-300 text-center group bg-gray-800"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {source.icon}
            </div>
            <div className="font-semibold text-gray-100 mb-2">{source.label}</div>
            <div className="text-sm text-gray-400">{source.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataSourceSelection;
