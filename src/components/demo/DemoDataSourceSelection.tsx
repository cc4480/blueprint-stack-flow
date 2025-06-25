
interface DataSource {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface DemoDataSourceSelectionProps {
  dataSources: DataSource[];
  selectedAppType: string;
  onSelectDataSource: (dataSource: string) => void;
}

const DemoDataSourceSelection = ({ dataSources, selectedAppType, onSelectDataSource }: DemoDataSourceSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          Building: <span className="font-semibold text-purple-600">{selectedAppType}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map(source => (
          <button
            key={source.id}
            onClick={() => onSelectDataSource(source.label)}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {source.icon}
            </div>
            <div className="font-semibold text-gray-800 mb-2">{source.label}</div>
            <div className="text-sm text-gray-600">{source.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoDataSourceSelection;
