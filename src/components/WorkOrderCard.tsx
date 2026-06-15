import { WorkOrder, Priority, Status } from '../App';
import { Calendar, User, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const STATUS_STYLES: Record<Status, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

const STATUSES: Status[] = ['Open', 'In Progress', 'Completed', 'Cancelled'];

interface Props {
  order: WorkOrder;
  onEdit: (order: WorkOrder) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

export default function WorkOrderCard({ order, onEdit, onDelete, onStatusChange }: Props) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isOverdue = order.status !== 'Completed' && order.status !== 'Cancelled' && new Date(order.dueDate) < new Date('2026-06-15');

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-gray-400">{order.id}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[order.priority]}`}>
              {order.priority}
            </span>
          </div>
          <h3 className="text-base font-semibold text-gray-800 truncate">{order.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{order.description}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User size={12} />
              {order.assignee}
            </span>
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
              <Calendar size={12} />
              {isOverdue ? 'Overdue · ' : ''}{order.dueDate}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(v => !v)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
              <ChevronDown size={11} />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-36 py-1">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(order.id, s); setShowStatusMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${s === order.status ? 'font-bold text-blue-600' : 'text-gray-700'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onEdit(order)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
