
interface AppType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface DemoAppTypeSelectionProps {
  appTypes: AppType[];
  onSelectAppType: (appType: string) => void;
}

const DemoAppTypeSelection = ({ appTypes, onSelectAppType }: DemoAppTypeSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appTypes.map(type => (
        <button
          key={type.id}
          onClick={() => onSelectAppType(type.label)}
          className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {type.icon}
          </div>
          <div className="font-semibold text-gray-800 mb-2">{type.label}</div>
          <div className="text-sm text-gray-600">{type.description}</div>
        </button>
      ))}
    </div>
  );
};

export default DemoAppTypeSelection;
