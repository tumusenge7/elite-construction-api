import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crud, contact } from '../../services/api';

const projectsApi = crud('projects');

const STATUS_TABS = ['All', 'Completed', 'In Progress', 'Proposed'];

// Map DB status values to display labels
const statusLabel = (s) => {
  if (s === 'completed') return 'Completed';
  if (['planning', 'design', 'site_preparation', 'foundation', 'structure', 'roofing', 'mep', 'finishing', 'inspection'].includes(s)) return 'In Progress';
  if (s === 'on_hold') return 'Proposed';
  return s;
};

const statusBadge = {
  'Completed': 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Proposed': 'bg-amber-100 text-amber-700',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'New Project Request', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    projectsApi.list({ limit: 100 }).then(res => {
      setProjects(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const filtered = projects.filter(p => {
    const label = statusLabel(p.status);
    const matchTab = activeTab === 'All' || label === activeTab;
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchTab && matchCat;
  });

  const counts = {
    Completed: projects.filter(p => statusLabel(p.status) === 'Completed').length,
    'In Progress': projects.filter(p => statusLabel(p.status) === 'In Progress').length,
    Proposed: projects.filter(p => statusLabel(p.status) === 'Proposed').length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contact.submit(form);
      setSubmitted(true);
    } catch {
      alert('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Our Projects</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Explore our portfolio — completed landmarks, active developments, and upcoming projects across Rwanda.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {Object.entries(counts).map(([label, count]) => (
              <div key={label} className="text-center">
                <div className={`text-3xl font-bold ${label === 'Completed' ? 'text-green-400' : label === 'In Progress' ? 'text-blue-400' : 'text-amber-400'}`}>{count}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {STATUS_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeCategory === cat ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug || project._id}`}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.coverImage || FALLBACK_IMG}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge[statusLabel(project.status)] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabel(project.status)}
                      </span>
                    </div>
                    {project.year && (
                      <div className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded">{project.year}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase">{project.category || 'General'}</span>
                      {project.location && <span className="text-xs text-gray-500">📍 {project.location}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    {project.description && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{project.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No projects found for this filter.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Have a Project in Mind?</h2>
          <p className="text-gray-300 mb-8">Let us bring your vision to life. Tell us about your project and we'll get back to you within 24 hours.</p>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105">
              Start Your Project →
            </button>
          ) : submitted ? (
            <div className="bg-green-900/40 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-green-400">Request Sent!</h3>
              <p className="text-gray-400 text-sm mt-2">Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 text-left space-y-4 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Describe Your Project *</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project — type, location, size, timeline..."
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-600 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all">
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
