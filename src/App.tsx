import { useState } from 'react';
import WorkOrderCard from './components/WorkOrderCard';
import WorkOrderModal from './components/WorkOrderModal';
import StatusFilter from './components/StatusFilter';
import { Plus, ClipboardList } from 'lucide-react';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

const SAMPLE_ORDERS: WorkOrder[] = [
  {
    id: 'WO-001',
    title: 'Replace HVAC Filter',
    description: 'Monthly filter replacement for main building HVAC unit.',
    priority: 'Medium',
    status: 'Open',
    assignee: 'John Smith',
    dueDate: '2026-06-20',
    createdAt: '2026-06-10',
  },
  {
    id: 'WO-002',
    title: 'Fix Conveyor Belt Motor',
    description: 'Motor on Line 3 conveyor showing abnormal vibration.',
    priority: 'Critical',
    status: 'In Progress',
    assignee: 'Maria Garcia',
    dueDate: '2026-06-16',
    createdAt: '2026-06-14',
  },
  {
    id: 'WO-003',
    title: 'Annual Safety Inspection',
    description: 'Conduct yearly safety inspection of all machinery.',
    priority: 'High',
    status: 'Open',
    assignee: 'David Lee',
    dueDate: '2026-06-30',
    createdAt: '2026-06-01',
  },
  {
    id: 'WO-004',
    title: 'Update Control Panel Software',
    description: 'Apply firmware v2.3 patch to control panel units.',
    priority: 'Low',
    status: 'Completed',
    assignee: 'Sarah Chen',
    dueDate: '2026-06-12',
    createdAt: '2026-06-05',
  },
  {
    id: 'WO-005',
    title: 'Lubricate Press Machine',
    description: 'Scheduled lubrication maintenance for hydraulic press.',
    priority: 'Medium',
    status: 'Completed',
    assignee: 'John Smith',
    dueDate: '2026-06-13',
    createdAt: '2026-06-08',
  },
];

export default function App() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(SAMPLE_ORDERS);
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState<WorkOrder | null>(null);

  const filtered = filter === 'All' ? workOrders : workOrders.filter(o => o.status === filter);

  const counts = {
    All: workOrders.length,
    Open: workOrders.filter(o => o.status === 'Open').length,
    'In Progress': workOrders.filter(o => o.status === 'In Progress').length,
    Completed: workOrders.filter(o => o.status === 'Completed').length,
    Cancelled: workOrders.filter(o => o.status === 'Cancelled').length,
  };

  const handleSave = (order: Omit<WorkOrder, 'id' | 'createdAt'>) => {
    if (editOrder) {
      setWorkOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, ...order } : o));
    } else {
      const newOrder: WorkOrder = {
        ...order,
        id: `WO-${String(workOrders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setWorkOrders(prev => [newOrder, ...prev]);
    }
    setShowModal(false);
    setEditOrder(null);
  };

  const handleDelete = (id: string) => {
    setWorkOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleEdit = (order: WorkOrder) => {
    setEditOrder(order);
    setShowModal(true);
  };

  const handleStatusChange = (id: string, status: Status) => {
    setWorkOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={26} />
            <span className="text-xl font-bold text-gray-800">Work Orders</span>
          </div>
          <button
            onClick={() => { setEditOrder(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Work Order
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(['Open', 'In Progress', 'Completed', 'Cancelled'] as Status[]).map(s => (
            <div key={s} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{counts[s]}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <StatusFilter filter={filter} setFilter={setFilter} counts={counts} />

        {/* List */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No work orders found.</p>
            </div>
          ) : (
            filtered.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <WorkOrderModal
          order={editOrder}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditOrder(null); }}
        />
      )}
    </div>
  );
}
