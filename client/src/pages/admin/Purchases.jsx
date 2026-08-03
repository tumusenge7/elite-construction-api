import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminPurchases() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch(API_BASE_URL + '/api/purchases', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(API_BASE_URL + `/api/purchases/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { draft: 'bg-gray-100 text-gray-500', sent: 'bg-blue-50 text-blue-700', confirmed: 'bg-teal-50 text-teal-700', delivered: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Purchase Orders</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['PO #', 'Supplier', 'Total', 'Status', 'Order Date', 'Expected Delivery', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">No purchase orders found</td></tr>
                : items.map(p => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.poNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{p.supplier?.name || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{p.total ? `$${Number(p.total).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status] || 'bg-gray-100 text-gray-500'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{p.orderDate ? new Date(p.orderDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.expectedDelivery ? new Date(p.expectedDelivery).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => del(p._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
