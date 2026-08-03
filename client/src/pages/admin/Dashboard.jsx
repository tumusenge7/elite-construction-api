import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';
import { Loader2, HardHat, Users, FileText, Receipt, Briefcase, Grid, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetch(API_BASE_URL + '/api/youtube/videos?limit=8')
      .then(r => r.json())
      .then(json => { if (json.success) setYoutubeVideos(json.data || []); })
      .catch(() => {})
      .finally(() => setYtLoading(false));
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch(API_BASE_URL + '/api/services/with-images?status=active')
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

  const quickLinks = [
    { label: 'Projects', path: '/admin/projects', icon: HardHat, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Customers', path: '/admin/customers', icon: Users, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Quotes', path: '/admin/quotes', icon: FileText, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Invoices', path: '/admin/invoices', icon: Receipt, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Employees', path: '/admin/employees', icon: Briefcase, color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { label: 'Services', path: '/admin/services', icon: Grid, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Manage your construction platform.</p>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {quickLinks.map(({ label, path, icon: Icon, color }) => (
            <Link key={path} to={path}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${color} hover:shadow-md transition-all hover:-translate-y-0.5`}>
              <Icon size={22} />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-[#1a3a5c]">Our Services</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live from the services catalog — visible on the public services page</p>
          </div>
          <Link to="/admin/services" className="text-sm text-[#3b82f6] hover:underline font-medium">Manage Services →</Link>
        </div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#3b82f6]" size={28} />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <Grid className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-400 text-sm">No services yet. Add one from the Services page.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <div key={s._id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
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
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <Grid size={32} />
                    </div>
                  )}
                  {s.videoUrl && (
                    <button
                      onClick={() => setActiveVideo(activeVideo === s._id ? null : s._id)}
                      className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow transition-all"
                    >
                      {activeVideo === s._id ? '📷 Photo' : '▶ Video'}
                    </button>
                  )}
                  {s.status === 'inactive' && (
                    <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                  {s.images?.length > 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {s.images.length}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[#1a3a5c] truncate">{s.name}</h3>
                    <span className="text-[10px] text-gray-400 shrink-0">#{i + 1}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(s.benefits || []).slice(0, 2).map((b, bi) => (
                      <span key={bi} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Channel Videos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-[#1a3a5c]">Channel Highlights</h2>
            <p className="text-xs text-gray-400 mt-0.5">Auto-synced from YouTube channel</p>
          </div>
          <a href="https://www.youtube.com/@blaisejavi" target="_blank" rel="noopener noreferrer"
            className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1">
            ▶ View Channel
          </a>
        </div>

        {ytLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#3b82f6]" size={28} />
          </div>
        ) : youtubeVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No videos found.</p>
            <p className="text-gray-400 text-xs mt-1">
              Add <code className="bg-gray-100 px-1 rounded">YOUTUBE_API_KEY</code> and{' '}
              <code className="bg-gray-100 px-1 rounded">YOUTUBE_CHANNEL_ID</code> to{' '}
              <code className="bg-gray-100 px-1 rounded">server/.env</code>
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {youtubeVideos.map((video, i) => (
              <div key={i}>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 truncate">{video.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
