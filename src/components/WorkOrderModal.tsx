import { useState, useEffect } from 'react';
import { WorkOrder, Priority, Status } from '../App';
import { X } from 'lucide-react';

interface Props {
  order: WorkOrder | null;
  onSave: (order: Omit<WorkOrder, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: Status[] = ['Open', 'In Progress', 'Completed', 'Cancelled'];

const EMPTY = {
  title: '',
  description: '',
  priority: 'Medium' as Priority,
  status: 'Open' as Status,
  assignee: '',
  dueDate: '',
};

export default function WorkOrderModal({ order, onSave, onClose }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setForm({
        title: order.title,
        description: order.description,
        priority: order.priority,
        status: order.status,
        assignee: order.assignee,
        dueDate: order.dueDate,
      });
    } else {
      setForm(EMPTY);
    }
  }, [order]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.assignee.trim()) e.assignee = 'Assignee is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">{order ? 'Edit Work Order' : 'New Work Order'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Replace belt on Line 2"
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Describe the work to be done..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
              <select value={form.priority} onChange={set('priority')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400">
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={set('status')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Assignee *</label>
              <input
                value={form.assignee}
                onChange={set('assignee')}
                placeholder="Full name"
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.assignee ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.assignee && <p className="text-xs text-red-500 mt-0.5">{errors.assignee}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={set('dueDate')}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${errors.dueDate ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-0.5">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              {order ? 'Save Changes' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
