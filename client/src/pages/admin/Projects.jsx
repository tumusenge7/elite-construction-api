import { useState, useEffect } from 'react';
import { Search, Plus, X, HardHat, Loader2, ImagePlus, Star } from 'lucide-react';
import { crud, uploads } from '../../services/api';

const statusColors = {
  planning: 'bg-gray-100 text-gray-700',
  design: 'bg-purple-100 text-purple-700',
  site_preparation: 'bg-orange-100 text-orange-700',
  foundation: 'bg-yellow-100 text-yellow-700',
  structure: 'bg-blue-100 text-blue-700',
  roofing: 'bg-indigo-100 text-indigo-700',
  mep: 'bg-pink-100 text-pink-700',
  finishing: 'bg-teal-100 text-teal-700',
  inspection: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const projectsApi = crud('projects');

const defaultForm = {
  name: '', category: '', status: 'planning', location: '',
  clientName: '', budget: '', year: new Date().getFullYear(),
  startDate: '', expectedCompletion: '', progress: 0,
  description: '', challenges: '', solutions: '', results: '',
  isHighlight: false,
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white';
const textareaCls = `${inputCls} resize-none`;

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await projectsApi.list({ limit: 100 });
      setProjects(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setSelectedFile(null);
    setCoverPreview(null);
    setShowDrawer(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '', category: p.category || '', status: p.status || 'planning',
      location: p.location || '', clientName: p.clientName || '', budget: p.budget || '',
      year: p.year || new Date().getFullYear(),
      startDate: p.startDate ? p.startDate.slice(0, 10) : '',
      expectedCompletion: p.expectedCompletion ? p.expectedCompletion.slice(0, 10) : '',
      progress: p.progress || 0,
      description: p.description || '', challenges: p.challenges || '',
      solutions: p.solutions || '', results: p.results || '',
      isHighlight: p.isHighlight || false,
    });
    setSelectedFile(null);
    setCoverPreview(null);
    setShowDrawer(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverImage = editing?.coverImage || null;
      if (selectedFile) {
        try {
          const res = await uploads.upload(selectedFile, 'projects');
          coverImage = res.data.data.path;
        } catch (err) {
          alert('Image upload failed: ' + (err.response?.data?.message || err.message));
          setSaving(false);
          return;
        }
      }
      const payload = { ...form, budget: form.budget ? Number(form.budget) : undefined, coverImage };
      if (editing) await projectsApi.update(editing._id, payload);
      else await projectsApi.create(payload);
      setShowDrawer(false);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save project.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await projectsApi.delete(id); loadProjects(); } catch {}
  };

  const filtered = projects.filter(p =>
    [p.name, p.clientName, p.location].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={36} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm">{projects.length} total projects</p>
        </div>
        <button onClick={openCreate} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Project</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Client</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Location</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Budget</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Progress</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.coverImage
                        ? <img src={p.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><HardHat className="text-gray-400" size={16} /></div>
                      }
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-1.5">
                          {p.name}
                          {p.isHighlight && <Star size={12} className="text-amber-500 fill-amber-500" />}
                        </div>
                        {p.category && <div className="text-xs text-gray-400">{p.category}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.clientName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-500'}`}>
                      {p.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.location || '—'}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium hidden lg:table-cell">{p.budget ? `$${(p.budget / 1000).toFixed(0)}K` : '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {p.progress !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{p.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <HardHat className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 text-sm">No projects found</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowDrawer(false)} />
          <div className="relative ml-auto w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Project' : 'New Project'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editing ? 'Update project details' : 'Fill in the project information below'}</p>
              </div>
              <button onClick={() => setShowDrawer(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">

                {/* Section: Cover Image */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">Cover Image</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                      {coverPreview || editing?.coverImage
                        ? <img src={coverPreview || editing.coverImage} alt="Preview" className="w-full h-full object-cover" />
                        : <ImagePlus className="text-gray-300" size={28} />
                      }
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" id="coverFile" className="hidden"
                        onChange={e => { const f = e.target.files[0]; if (f) { setSelectedFile(f); setCoverPreview(URL.createObjectURL(f)); } }} />
                      <label htmlFor="coverFile" className="inline-block cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        {coverPreview || editing?.coverImage ? 'Change Image' : 'Upload Image'}
                      </label>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Section: Basic Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">Basic Information</h3>
                  <div className="space-y-4">
                    <Field label="Project Name" required>
                      <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="e.g. Skyline Tower" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Category">
                        <input type="text" value={form.category} onChange={e => set('category', e.target.value)} className={inputCls} placeholder="e.g. Residential" />
                      </Field>
                      <Field label="Status">
                        <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                          <option value="planning">Planning</option>
                          <option value="design">Design</option>
                          <option value="site_preparation">Site Preparation</option>
                          <option value="foundation">Foundation</option>
                          <option value="structure">Structure</option>
                          <option value="roofing">Roofing</option>
                          <option value="mep">MEP</option>
                          <option value="finishing">Finishing</option>
                          <option value="inspection">Inspection</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Client Name">
                        <input type="text" value={form.clientName} onChange={e => set('clientName', e.target.value)} className={inputCls} placeholder="Client or company name" />
                      </Field>
                      <Field label="Location">
                        <input type="text" value={form.location} onChange={e => set('location', e.target.value)} className={inputCls} placeholder="e.g. Kigali, Rwanda" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Budget ($)">
                        <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} className={inputCls} placeholder="0" />
                      </Field>
                      <Field label="Year">
                        <input type="number" value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Section: Timeline & Progress */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">Timeline & Progress</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start Date">
                        <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Expected Completion">
                        <input type="date" value={form.expectedCompletion} onChange={e => set('expectedCompletion', e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                    <Field label={`Progress — ${form.progress}%`}>
                      <div className="flex items-center gap-3 mt-1">
                        <input type="range" min={0} max={100} value={form.progress} onChange={e => set('progress', Number(e.target.value))} className="flex-1 accent-blue-600" />
                        <span className="text-sm font-semibold text-blue-600 w-10 text-right">{form.progress}%</span>
                      </div>
                      <div className="mt-2 bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${form.progress}%` }} />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Section: Project Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">Project Details</h3>
                  <div className="space-y-4">
                    <Field label="Overview / Description">
                      <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} className={textareaCls}
                        placeholder="Describe the project — scope, objectives, key features..." />
                    </Field>
                    <Field label="The Challenge">
                      <textarea rows={3} value={form.challenges} onChange={e => set('challenges', e.target.value)} className={textareaCls}
                        placeholder="What difficulties or obstacles did this project face?" />
                    </Field>
                    <Field label="Our Solution">
                      <textarea rows={3} value={form.solutions} onChange={e => set('solutions', e.target.value)} className={textareaCls}
                        placeholder="How did your team approach and solve those challenges?" />
                    </Field>
                    <Field label="The Result">
                      <textarea rows={3} value={form.results} onChange={e => set('results', e.target.value)} className={textareaCls}
                        placeholder="What was the final outcome? Awards, certifications, client feedback..." />
                    </Field>
                  </div>
                </div>

                {/* Section: Visibility */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">Visibility</h3>
                  <label className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                    <input type="checkbox" checked={form.isHighlight} onChange={e => set('isHighlight', e.target.checked)} className="w-4 h-4 accent-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">⭐ Feature on Homepage</p>
                      <p className="text-xs text-amber-600 mt-0.5">This project will appear in the featured projects section on the public website</p>
                    </div>
                  </label>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDrawer(false)} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
