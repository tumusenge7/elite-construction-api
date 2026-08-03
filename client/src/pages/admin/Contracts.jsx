import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminContracts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch(API_BASE_URL + '/api/contracts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(API_BASE_URL + `/api/contracts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { draft: 'bg-gray-100 text-gray-500', sent: 'bg-blue-50 text-blue-700', accepted: 'bg-teal-50 text-teal-700', active: 'bg-green-50 text-green-700', completed: 'bg-indigo-50 text-indigo-700', terminated: 'bg-red-50 text-red-700', cancelled: 'bg-red-50 text-red-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Contracts</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Contract #', 'Title', 'Customer', 'Value', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No contracts found</td></tr>
                : items.map(c => (
                  <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.contractNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{c.title}</td>
                    <td className="px-4 py-3 text-gray-500">{c.customer?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{c.contractValue ? `$${Number(c.contractValue).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status] || 'bg-gray-100 text-gray-500'}`}>{c.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => del(c._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
