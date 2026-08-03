import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Users, FileText, Plus, Loader2, Edit3, Trash2, X, Upload, Check, Search, Layers } from 'lucide-react';
import { crud } from '../../services/api';

const TABS = [
  { id: 'team', name: 'Team Members', icon: Users },
  { id: 'content', name: 'Website Content', icon: FileText },
];

export default function AllThings() {
  const [tab, setTab] = useState('team');

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
          <Layers className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">All Things</h1>
          <p className="text-gray-500 text-sm">Manage everything on the website</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-[#1a3a5c] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <t.icon size={16} />
            {t.name}
          </button>
        ))}
      </div>

      {tab === 'team' ? <TeamSection /> : <ContentSection />}
    </div>
  );
}

function TeamSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const api = useMemo(() => crud('team-members'), []);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.list({ limit: 100 });
      setData(res.data.data || []);
    } catch {} finally { setLoading(false); }
  }, [api]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = data.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase()) ||
    m.dept?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      if (modal._id) { await api.update(modal._id, form); }
      else { await api.create(form); }
      setModal(null); fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await api.delete(id);
      fetchData();
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3b82f6]" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1a3a5c]">Team Members</h2>
          <p className="text-gray-500 text-sm">{data.length} members shown on the public Team page</p>
        </div>
        <button onClick={() => setModal({})} className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Image</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Role</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Dept</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id} className="border-t border-gray-100 hover:bg-[#3b82f6]/5 transition-all">
                  <td className="px-4 py-3">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{m.name.charAt(0)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1a3a5c]">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.role}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.dept || '-'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${m.status !== 'inactive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.status || 'active'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(m)} className="p-1.5 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-gray-100 transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(m._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <Users className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No team members found</p>
            </div>
          )}
        </div>
      </div>

      {modal && <MemberForm member={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function MemberForm({ member, onSave, onClose }) {
  const [form, setForm] = useState({
    name: member.name || '',
    role: member.role || '',
    dept: member.dept || '',
    bio: member.bio || '',
    image: member.image || '',
    order: member.order || 0,
    status: member.status || 'active',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(API_BASE_URL + '/api/uploads?category=team', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const json = await res.json();
      if (json.success) setForm(f => ({ ...f, image: json.data.path }));
    } catch {} finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a3a5c]">{member._id ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
            <div className="flex items-center gap-3">
              {form.image ? (
                <img src={form.image} alt="member" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                  <Users size={24} />
                </div>
              )}
              <div className="flex gap-2 flex-1">
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="https://... or upload" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50">
                  {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                  {uploading ? '...' : 'Upload'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
              <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="e.g. CEO & Founder" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <input value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="e.g. Engineering" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-all">{member._id ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContentSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const api = useMemo(() => crud('settings'), []);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.list({ limit: 100 });
      setData(res.data.data || []);
    } catch {} finally { setLoading(false); }
  }, [api]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = data.filter(s =>
    s.settingKey?.toLowerCase().includes(search.toLowerCase()) ||
    String(s.settingValue ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (s.group || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      if (modal._id) { await api.update(modal._id, form); }
      else { await api.create(form); }
      setModal(null); fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this setting?')) return;
    try {
      await api.delete(id);
      fetchData();
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3b82f6]" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1a3a5c]">Website Content</h2>
          <p className="text-gray-500 text-sm">{data.length} content entries (text shown on the website)</p>
        </div>
        <button onClick={() => setModal({})} className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus size={18} /> Add Content
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Key</th>
                <th className="px-4 py-3 font-medium text-gray-600">Value</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Group</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-t border-gray-100 hover:bg-[#3b82f6]/5 transition-all">
                  <td className="px-4 py-3 font-medium text-[#1a3a5c] whitespace-nowrap">{s.settingKey}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{String(s.settingValue ?? '')}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.group || '-'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{s.type || 'text'}</span>
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
              <FileText className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No content entries found</p>
            </div>
          )}
        </div>
      </div>

      {modal && <ContentForm item={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function ContentForm({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    settingKey: item.settingKey || '',
    settingValue: item.settingValue ?? '',
    group: item.group || '',
    type: item.type || 'text',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a3a5c]">{item._id ? 'Edit Content' : 'Add Content'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Key *</label>
              <input required disabled={!!item._id} value={form.settingKey} onChange={e => setForm({ ...form, settingKey: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm disabled:bg-gray-50 disabled:text-gray-500" placeholder="e.g. about_heading" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Value *</label>
            <textarea rows={4} required value={form.settingValue} onChange={e => setForm({ ...form, settingValue: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Group (optional)</label>
            <input value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" placeholder="e.g. about, hero, footer" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-all flex items-center justify-center gap-2"><Check size={16} /> {item._id ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
