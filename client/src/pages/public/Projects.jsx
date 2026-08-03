import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contact } from '../../services/api';
import { toProjectCards, FALLBACK_IMG } from '../../components/projects/projectsData';

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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'New Project Request', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    fetch('/api/projects?limit=100')
      .then(r => r.json())
      .then(json => { setProjects(json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/api/services/with-images?status=active')
      .then(r => r.json())
      .then(json => {
        if (mounted) {
          setServices((json.data || []).map(s => ({
            ...s,
            benefits: (s.benefits || '').split(',').map(b => b.trim()).filter(Boolean),
          })));
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setServicesLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    fetch('/api/youtube/videos?limit=6')
      .then(r => r.json())
      .then(json => { if (json.success) setVideos(json.data || []); })
      .catch(() => {})
      .finally(() => setVideosLoading(false));
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

  const showcaseCards = filtered.map(p => {
    const card = toProjectCards([p])[0];
    const label = statusLabel(p.status);
    return { ...card, badge: label, badgeClass: statusBadge[label] || 'bg-white/90 text-gray-700' };
  });

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
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Portfolio</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Project Gallery</h2>
            <p className="text-gray-500 mt-2">Browse our complete portfolio — every project we're proud to showcase.</p>
          </div>

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
          ) : showcaseCards.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseCards.map(p => (
                <Link key={p.id} to={p.link} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {p.badge && (
                      <span className={`absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full shadow ${p.badgeClass || 'bg-white/90 text-gray-700'}`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{p.category}</span>
                      {p.year && <span className="text-xs text-gray-400">{p.year}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description || 'A project delivered by our team.'}</p>
                    <div className="flex items-center justify-between gap-2">
                      {p.location && <span className="text-xs text-gray-400 truncate">📍 {p.location}</span>}
                      <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">View Project →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No projects found for this filter.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Services</h2>
              <p className="text-gray-500 mt-1">Live from our services catalog</p>
            </div>
            <Link to="/services" className="text-blue-600 font-semibold hover:underline text-sm">View All Services →</Link>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No services available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => (
                <div key={s._id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    {activeVideo === s._id && s.videoUrl ? (
                      <iframe
                        src={s.videoUrl}
                        title={s.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : s.image ? (
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-3xl">🏗️</div>
                    )}
                    {s.videoUrl && (
                      <button
                        onClick={() => setActiveVideo(activeVideo === s._id ? null : s._id)}
                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow transition-all"
                      >
                        {activeVideo === s._id ? '📷 Photo' : '▶ Video'}
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1.5">{s.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{s.description}</p>
                    {s.benefits?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {s.benefits.slice(0, 3).map((b, i) => (
                          <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{b}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">Our Channel</span>
              <h2 className="text-3xl font-bold text-white mt-1">Latest Videos</h2>
              <p className="text-gray-400 text-sm mt-1">Watch our latest construction projects and updates</p>
            </div>
            <a href="https://www.youtube.com/@blaisejavi" target="_blank" rel="noopener noreferrer"
              className="text-xs text-red-400 hover:underline font-medium flex items-center gap-1 shrink-0">
              ▶ View Channel
            </a>
          </div>

          {videosLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No videos available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="group rounded-xl overflow-hidden bg-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  {playing === video.id ? (
                    <div className="aspect-video">
                      <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`} title={video.title}
                        className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ) : (
                    <div className="aspect-video relative cursor-pointer" onClick={() => setPlaying(video.id)}>
                      <img src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-red-400 transition-colors">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-900 border-t border-white/10">
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
