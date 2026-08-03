import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus } from 'lucide-react';

const empty = { name: '', email: '', phone: '', address: '', category: '' };

export default function AdminSuppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/suppliers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); setForm(empty); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/suppliers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Suppliers</h1>
        <button onClick={() => { setForm(empty); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> Add Supplier
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Name', 'Category', 'Email', 'Phone', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">No suppliers found</td></tr>
                : items.map(s => (
                  <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.phone || '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => del(s._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-[#1a3a5c]">Add Supplier</h2>
            <form onSubmit={save} className="space-y-3">
              {[['name','Name',true],['category','Category'],['email','Email'],['phone','Phone'],['address','Address']].map(([k,l,req]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input required={!!req} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
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
