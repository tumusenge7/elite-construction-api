import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus, Pencil } from 'lucide-react';

const empty = { title: '', slug: '', excerpt: '', content: '', status: 'draft' };

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/blog', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const openEdit = (item) => { setForm({ title: item.title, slug: item.slug || '', excerpt: item.excerpt || '', content: item.content || '', status: item.status || 'draft' }); setEditId(item._id); setModal(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const url = editId ? `/api/blog/${editId}` : '/api/blog';
    await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); setForm(empty); setEditId(null); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const statusColor = { draft: 'bg-gray-100 text-gray-500', published: 'bg-green-50 text-green-700', archived: 'bg-amber-50 text-amber-700' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Blog Posts</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> New Post
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Title', 'Status', 'Published', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={4} className="text-center py-12 text-gray-400">No blog posts found</td></tr>
                : items.map(b => (
                  <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] || 'bg-gray-100 text-gray-500'}`}>{b.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button onClick={() => openEdit(b)} className="text-blue-400 hover:text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => del(b._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-[#1a3a5c]">{editId ? 'Edit Post' : 'New Post'}</h2>
            <form onSubmit={save} className="space-y-3">
              {[['title','Title',true],['slug','Slug'],['excerpt','Excerpt']].map(([k,l,req]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input required={!!req} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                <textarea rows={5} value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  {['draft','published','archived'].map(s => <option key={s} value={s}>{s}</option>)}
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
