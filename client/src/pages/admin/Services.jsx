import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Plus, Grid, Loader2, Edit3, Trash2, X, Image as ImageIcon, Upload, ArrowUp, ArrowDown, Star, Check } from 'lucide-react';
import { crud } from '../../services/api';

export default function AdminServices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [imagesService, setImagesService] = useState(null);
  const api = useMemo(() => crud('services'), []);

  const fetchData = useCallback(async () => {
    try { const res = await api.list({ limit: 100 }); setData(res.data.data || []); } catch {} finally { setLoading(false); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
      try {
        await api.delete(id);
        fetch(`/api/services/${id}/images`).then(r => r.json()).then(json => {
          (json.data || []).forEach(img => {
            fetch(`/api/services/images/${img._id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
          });
        }).catch(() => {});
        fetchData();
      } catch {}
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
                <th className="px-4 py-3 font-medium text-gray-600">Image</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Slug</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-t border-gray-100 hover:bg-[#3b82f6]/5 transition-all cursor-default">
                  <td className="px-4 py-3">
                    <div className="relative w-14 h-10 rounded overflow-hidden bg-gray-100">
                      {s.image ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No img</div>}
                      {s.videoUrl && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px]">▶</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1a3a5c]">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">{s.category || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{s.slug}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${s.status !== 'inactive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.status || 'active'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setImagesService(s)} title="Manage images" className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-gray-100 transition-all"><ImageIcon size={16} /></button>
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

      {imagesService && (
        <ImageManager service={imagesService} onClose={() => setImagesService(null)} onSaved={fetchData} />
      )}
    </div>
  );
}

function ImageManager({ service, onClose, onSaved }) {
  const [images, setImages] = useState([]);
  const [pending, setPending] = useState([]);
  const [cover, setCover] = useState(service.image || '');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/services/${service._id}/images`);
      const json = await res.json();
      setImages(json.data || []);
    } catch {} finally { setLoading(false); }
  }, [service._id]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await fetch('/api/uploads/multiple?category=services', {
        method: 'POST',
        headers: authHeaders,
        body: fd,
      });
      const json = await res.json();
      if (json.success && json.data?.length) {
        setPending(p => [...p, ...json.data.map((f, i) => ({ key: `${Date.now()}-${i}`, image: f.path, caption: '' }))]);
      }
    } catch {} finally { setUploading(false); e.target.value = ''; }
  };

  const handleSaveNew = async () => {
    if (!pending.length || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/services/${service._id}/images`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(pending.map(p => ({ image: p.image, caption: p.caption }))),
      });
      const json = await res.json();
      if (json.success) {
        setPending([]);
        loadImages(); onSaved();
      }
    } catch {} finally { setSaving(false); }
  };

  const removePending = (key) => setPending(p => p.filter(x => x.key !== key));

  const updateImage = async (id, data) => {
    try {
      await fetch(`/api/services/images/${id}`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      loadImages();
    } catch {}
  };

  const deleteImage = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`/api/services/images/${id}`, { method: 'DELETE', headers: authHeaders });
      loadImages();
    } catch {}
  };

  const reorder = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    try {
      await fetch(`/api/services/${service._id}/images/reorder`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: next.map(i => i._id) }),
      });
    } catch {}
  };

  const setCoverImage = async (img) => {
    try {
      await fetch(`/api/services/${service._id}`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: img.image }),
      });
      setCover(img.image);
      onSaved();
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-[#1a3a5c]">Service Images</h2>
            <p className="text-xs text-gray-400 mt-0.5">{service.name} — {images.length + pending.length} photo{images.length + pending.length === 1 ? '' : 's'}, shown in ascending order</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full mb-5 mt-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 text-gray-600 hover:text-[#3b82f6] text-sm font-medium py-4 rounded-xl transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          {uploading ? 'Uploading...' : 'Add one or more photos'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

        {pending.length > 0 && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-sm text-blue-800 font-medium">{pending.length} new photo{pending.length === 1 ? '' : 's'} ready to save</p>
            <button
              onClick={handleSaveNew}
              disabled={saving}
              className="shrink-0 bg-[#3b82f6] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-[#3b82f6]" size={28} /></div>
        ) : images.length === 0 && pending.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-400 text-sm">No photos yet. Upload some to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={img._id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3">
                <span className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">{i + 1}</span>
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={img.image} alt={img.caption || `photo ${i + 1}`} className="w-full h-full object-cover" />
                  {img.image === cover && <span className="absolute top-0.5 left-0.5 text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">Cover</span>}
                </div>
                <input
                  defaultValue={img.caption}
                  onBlur={e => updateImage(img._id, { caption: e.target.value })}
                  placeholder="Add a caption..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm"
                />
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setCoverImage(img)} title="Set as cover" className={`p-1.5 rounded-lg transition-all ${img.image === cover ? 'text-indigo-500 bg-indigo-50' : 'text-gray-400 hover:text-indigo-500 hover:bg-gray-100'}`}><Star size={16} /></button>
                  <button onClick={() => reorder(i, -1)} title="Move up" className="p-1.5 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30" disabled={i === 0}><ArrowUp size={16} /></button>
                  <button onClick={() => reorder(i, 1)} title="Move down" className="p-1.5 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30" disabled={i === images.length - 1}><ArrowDown size={16} /></button>
                  <button onClick={() => deleteImage(img._id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {pending.map((p, pi) => (
              <div key={p.key} className="flex items-center gap-3 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-3">
                <span className="w-6 text-center text-xs font-bold text-blue-400 shrink-0">{images.length + pi + 1}</span>
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={p.image} alt={p.caption || `new photo ${pi + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-0.5 left-0.5 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">New</span>
                </div>
                <input
                  value={p.caption}
                  onChange={e => setPending(prev => prev.map(x => x.key === p.key ? { ...x, caption: e.target.value } : x))}
                  placeholder="Add a caption..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm"
                />
                <button onClick={() => removePending(p.key)} title="Remove" className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all shrink-0"><X size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceForm({ service, onSave, onClose }) {
  const [form, setForm] = useState({
    name: service.name || '',
    category: service.category || '',
    description: service.description || '',
    benefits: service.benefits || '',
    process: service.process || '',
    status: service.status || 'active',
    videoUrl: service.videoUrl || '',
    image: service.image || '',
  });
  const [stagedImage, setStagedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/uploads?category=services', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const json = await res.json();
      if (json.success) setStagedImage(json.data.path);
    } catch {}
    e.target.value = '';
  };

  const saveStagedImage = () => {
    if (!stagedImage) return;
    setForm(f => ({ ...f, image: stagedImage }));
    setStagedImage(null);
  };

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
            <label className="block text-xs font-medium text-gray-600 mb-1">Process (comma separated)</label>
            <textarea rows={2} value={form.process} onChange={e => setForm({...form, process: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm resize-none" placeholder="e.g. Consultation, Design, Construction, Handover" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
            <div className="flex gap-2">
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="https://... or upload" />
              <label className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-all">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {stagedImage ? (
              <div className="mt-2 flex items-center gap-3 border border-blue-200 bg-blue-50 rounded-lg p-2">
                <img src={stagedImage} alt="staged preview" className="h-14 w-20 rounded object-cover shrink-0" />
                <p className="flex-1 text-xs font-medium text-blue-800">New image ready — save it as the cover photo?</p>
                <button type="button" onClick={saveStagedImage} className="shrink-0 flex items-center gap-1.5 bg-[#3b82f6] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-all"><Check size={14} /> Save</button>
                <button type="button" onClick={() => setStagedImage(null)} title="Discard" className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all"><X size={14} /></button>
              </div>
            ) : (
              form.image && <img src={form.image} alt="preview" className="mt-2 h-20 rounded object-cover" />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">YouTube Video URL</label>
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
