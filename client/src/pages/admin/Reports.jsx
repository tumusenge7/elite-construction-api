import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/reports/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Daily Reports</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Project', 'Workers Present', 'Weather', 'Report Date', 'Created By', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No reports found</td></tr>
                : items.map(r => (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.project?.title || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{r.workersPresent ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{r.weather || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{r.reportDate ? new Date(r.reportDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{r.createdBy?.firstName ? `${r.createdBy.firstName} ${r.createdBy.lastName || ''}` : '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => del(r._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
