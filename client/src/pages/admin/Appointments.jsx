import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { pending: 'bg-amber-50 text-amber-700', approved: 'bg-blue-50 text-blue-700', rescheduled: 'bg-orange-50 text-orange-700', completed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700' };
  const typeLabel = { site_visit: 'Site Visit', meeting: 'Meeting', inspection: 'Inspection', consultation: 'Consultation', other: 'Other' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Appointments</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Title', 'Type', 'Customer', 'Preferred Date', 'Confirmed Date', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">No appointments found</td></tr>
                : items.map(a => (
                  <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.title}</td>
                    <td className="px-4 py-3 text-gray-500">{typeLabel[a.type] || a.type}</td>
                    <td className="px-4 py-3 text-gray-500">{a.customer?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{a.preferredDate ? new Date(a.preferredDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{a.confirmedDate ? new Date(a.confirmedDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status] || 'bg-gray-100 text-gray-500'}`}>{a.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => del(a._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
