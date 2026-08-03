import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Loader2, Trash2 } from 'lucide-react';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch(API_BASE_URL + '/api/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(API_BASE_URL + `/api/inventory/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const lowStock = (i) => i.minStock > 0 && i.quantity <= i.minStock;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a3a5c]">Inventory</h1>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Material', 'Quantity', 'Min Stock', 'Location', 'Unit Cost', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No inventory records found</td></tr>
                : items.map(i => (
                  <tr key={i._id} className={`border-b border-gray-100 hover:bg-gray-50 ${lowStock(i) ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{i.material?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${lowStock(i) ? 'text-red-600' : 'text-gray-700'}`}>{i.quantity}</span>
                      {lowStock(i) && <span className="ml-2 text-xs text-red-500">Low stock</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{i.minStock || 0}</td>
                    <td className="px-4 py-3 text-gray-500">{i.location || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{i.unitCost ? `$${Number(i.unitCost).toLocaleString()}` : '—'}</td>
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
