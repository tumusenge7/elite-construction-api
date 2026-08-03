import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus } from 'lucide-react';

const empty = { name: '', category: '', serialNumber: '', status: 'available', location: '', notes: '' };
const statuses = ['available', 'in_use', 'maintenance', 'unavailable', 'retired'];

export default function AdminEquipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/equipment', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.success) alert(json.message || 'Failed to save');
    setSaving(false); setModal(false); setForm(empty); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/equipment/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { available: 'bg-green-50 text-green-700', in_use: 'bg-blue-50 text-blue-700', maintenance: 'bg-amber-50 text-amber-700', unavailable: 'bg-orange-50 text-orange-700', retired: 'bg-gray-100 text-gray-500' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Equipment</h1>
        <button onClick={() => { setForm(empty); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> Add Equipment
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Name', 'Category', 'Serial #', 'Location', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No equipment found</td></tr>
                : items.map(eq => (
                  <tr key={eq._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{eq.name}</td>
                    <td className="px-4 py-3 text-gray-500">{eq.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{eq.serialNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{eq.location || '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[eq.status] || 'bg-gray-100 text-gray-500'}`}>{eq.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => del(eq._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-[#1a3a5c]">Add Equipment</h2>
            <form onSubmit={save} className="space-y-3">
              {[['name','Name',true],['category','Category'],['serialNumber','Serial Number'],['location','Location']].map(([k,l,req]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input required={!!req} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
