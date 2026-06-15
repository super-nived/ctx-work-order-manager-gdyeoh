import { Status } from '../App';

type Filter = Status | 'All';

interface Props {
  filter: Filter;
  setFilter: (f: Filter) => void;
  counts: Record<string, number>;
}

const TABS: Filter[] = ['All', 'Open', 'In Progress', 'Completed', 'Cancelled'];

export default function StatusFilter({ filter, setFilter, counts }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === tab
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {tab}
          <span className={`ml-1.5 text-xs ${filter === tab ? 'text-blue-100' : 'text-gray-400'}`}>
            {counts[tab] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
