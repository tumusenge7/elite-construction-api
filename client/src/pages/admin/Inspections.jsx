import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminInspections() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/inspections', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/inspections/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { draft: 'bg-gray-100 text-gray-500', completed: 'bg-green-50 text-green-700', reviewed: 'bg-blue-50 text-blue-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Site Inspections</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Project', 'Inspector', 'Weather', 'Status', 'Date', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No inspections found</td></tr>
                : items.map(i => (
                  <tr key={i._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{i.project?.title || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{i.inspector?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{i.weather || '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[i.status] || 'bg-gray-100 text-gray-500'}`}>{i.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{i.inspectionDate ? new Date(i.inspectionDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => del(i._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
