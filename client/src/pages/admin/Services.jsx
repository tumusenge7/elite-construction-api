import { useState, useEffect } from 'react';
import { Search, Plus, Grid, Loader2, Edit3, Trash2, X } from 'lucide-react';
import { crud } from '../../services/api';

export default function AdminServices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const api = crud('services');

  const fetchData = async () => {
    try { const res = await api.list({ limit: 100 }); setData(res.data.data || []); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      if (modal._id) { await api.update(modal._id, form); }
      else { await api.create(form); }
      setModal(null); fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this service?')) {
      try { await api.delete(id); fetchData(); } catch {}
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3b82f6]" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Services</h1>
          <p className="text-gray-500 text-sm">{data.length} services</p>
        </div>
        <button onClick={() => setModal({})} className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Slug</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s._id} className="border-t border-gray-100 hover:bg-[#3b82f6]/5 transition-all cursor-default">
                  <td className="px-4 py-3 font-medium text-[#1a3a5c]">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">{s.category || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{s.slug}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${s.status !== 'inactive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.status || 'active'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(s)} className="p-1.5 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-gray-100 transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <Grid className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No services found</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ServiceForm service={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function ServiceForm({ service, onSave, onClose }) {
  const [form, setForm] = useState({
    name: service.name || '',
    category: service.category || '',
    description: service.description || '',
    benefits: service.benefits || '',
    status: service.status || 'active',
    videoUrl: service.videoUrl || '',
    imageUrl: service.imageUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a3a5c]">{service._id ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
                <option value="">Select</option>
                <option value="construction">Construction</option>
                <option value="design">Design</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Benefits (comma separated)</label>
            <textarea rows={2} value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm resize-none" placeholder="e.g. Custom design, Quality materials, Timely delivery" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image URL (highlight)</label>
            <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="https://..." />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-20 rounded object-cover" />}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">YouTube Video URL (highlight)</label>
            <input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-all">{service._id ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
