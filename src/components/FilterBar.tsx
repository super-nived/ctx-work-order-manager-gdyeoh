import React from 'react';

type Status = 'All' | 'Open' | 'In Progress' | 'Completed';

interface FilterBarProps {
  active: Status;
  onChange: (status: Status) => void;
  counts: Record<Status, number>;
}

const STATUSES: Status[] = ['All', 'Open', 'In Progress', 'Completed'];

export default function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            active === s
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          {s}
          <span
            className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              active === s ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {counts[s]}
          </span>
        </button>
      ))}
    </div>
  );
}
