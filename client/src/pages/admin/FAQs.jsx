import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus, Pencil } from 'lucide-react';

const empty = { question: '', answer: '', category: '', order: 0 };

export default function AdminFAQs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/faqs', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const openEdit = (item) => { setForm({ question: item.question, answer: item.answer, category: item.category || '', order: item.order || 0 }); setEditId(item._id); setModal(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const url = editId ? `/api/faqs/${editId}` : '/api/faqs';
    await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); setForm(empty); setEditId(null); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/faqs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">FAQs</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> Add FAQ
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Question', 'Category', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={3} className="text-center py-12 text-gray-400">No FAQs found</td></tr>
                : items.map(f => (
                  <tr key={f._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{f.question}</td>
                    <td className="px-4 py-3 text-gray-500">{f.category || '—'}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button onClick={() => openEdit(f)} className="text-blue-400 hover:text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => del(f._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="font-bold text-[#1a3a5c]">{editId ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                <input required value={form.question} onChange={e => setForm(f => ({...f, question: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                <textarea required rows={4} value={form.answer} onChange={e => setForm(f => ({...f, answer: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <input value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
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
