import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchTasks = () => {
    setLoading(true);
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setTasks(j.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchTasks, [token]);

  const del = async (id) => {
    if (!confirm('Delete this task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const priorityColor = { low: 'bg-gray-100 text-gray-500', medium: 'bg-blue-50 text-blue-700', high: 'bg-orange-50 text-orange-700', urgent: 'bg-red-50 text-red-700' };
  const statusColor = { todo: 'bg-gray-100 text-gray-500', in_progress: 'bg-blue-50 text-blue-700', review: 'bg-amber-50 text-amber-700', completed: 'bg-green-50 text-green-700', blocked: 'bg-red-50 text-red-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Tasks</h1>
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Task Name', 'Project', 'Priority', 'Status', 'Due Date', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No tasks found</td></tr>
              ) : tasks.map(t => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{t.taskName}</td>
                  <td className="px-4 py-3 text-gray-500">{t.project?.title || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[t.priority] || 'bg-gray-100 text-gray-500'}`}>{t.priority}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[t.status] || 'bg-gray-100 text-gray-500'}`}>{t.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3"><button onClick={() => del(t._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
