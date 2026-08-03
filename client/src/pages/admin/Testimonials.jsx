import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus, Pencil } from 'lucide-react';

const empty = { customerName: '', customerTitle: '', comment: '', rating: 5, status: 'pending' };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/testimonials', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const openEdit = (item) => {
    setForm({ customerName: item.customerName || '', customerTitle: item.customerTitle || '', comment: item.comment || '', rating: item.rating || 5, status: item.status || 'pending' });
    setEditId(item._id); setModal(true);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const url = editId ? `/api/testimonials/${editId}` : '/api/testimonials';
    const res = await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    });
    const json = await res.json();
    if (!json.success) alert(json.message || 'Failed to save');
    setSaving(false); setModal(false); setForm(empty); setEditId(null); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { pending: 'bg-amber-50 text-amber-700', approved: 'bg-green-50 text-green-700', rejected: 'bg-red-50 text-red-700' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Testimonials</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Client', 'Title', 'Rating', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">No testimonials found</td></tr>
                : items.map(t => (
                  <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.customerName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{t.customerTitle || '—'}</td>
                    <td className="px-4 py-3 text-amber-500">{'★'.repeat(t.rating || 5)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[t.status] || 'bg-gray-100 text-gray-500'}`}>{t.status}</span></td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="text-blue-400 hover:text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => del(t._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-[#1a3a5c]">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <form onSubmit={save} className="space-y-3">
              {[['customerName','Client Name',true],['customerTitle','Title / Position']].map(([k,l,req]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input required={!!req} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                <textarea required rows={3} value={form.comment} onChange={e => setForm(f => ({...f, comment: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                  <select value={form.rating} onChange={e => setForm(f => ({...f, rating: Number(e.target.value)}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {['pending','approved','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
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
