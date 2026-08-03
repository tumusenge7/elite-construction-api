import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Search, HardHat, MapPin, Calendar, Loader2, ClipboardList, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColor = {
  planning: 'bg-gray-100 text-gray-600',
  design: 'bg-indigo-100 text-indigo-700',
  site_preparation: 'bg-orange-100 text-orange-700',
  foundation: 'bg-yellow-100 text-yellow-700',
  structure: 'bg-blue-100 text-blue-700',
  roofing: 'bg-cyan-100 text-cyan-700',
  mep: 'bg-violet-100 text-violet-700',
  finishing: 'bg-teal-100 text-teal-700',
  inspection: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-blue-100 text-blue-700',
  on_hold: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  // request statuses
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
};

const statusLabel = {
  planning: 'Planning',
  design: 'Design',
  site_preparation: 'Site Preparation',
  foundation: 'Foundation',
  structure: 'Structure',
  roofing: 'Roofing',
  mep: 'MEP Works',
  finishing: 'Finishing',
  inspection: 'Inspection',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending Review',
  reviewing: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  converted: 'Converted to Project',
};

export default function CustomerProjects() {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('requests'); // 'requests' | 'projects'
  const token = localStorage.getItem('token');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(API_BASE_URL + '/api/projects', { headers }).then(r => r.json()),
      fetch(API_BASE_URL + '/api/project-requests', { headers }).then(r => r.json()),
    ])
      .then(([p, pr]) => {
        setProjects(p.data || []);
        setRequests(pr.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filteredProjects = projects.filter(p =>
    (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = requests.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">My Projects</h1>
          <p className="text-gray-500 text-sm">Track your requests and active construction projects</p>
        </div>
        <Link to="/customer/request-project"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shrink-0">
          <PlusCircle size={15} /> New Request
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-5">
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            tab === 'requests' ? 'bg-white text-[#1a3a5c] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          Requests <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{requests.length}</span>
        </button>
        <button
          onClick={() => setTab('projects')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            tab === 'projects' ? 'bg-white text-[#1a3a5c] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          Projects <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{projects.length}</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 text-sm" />
        </div>
      </div>

      {/* Requests tab */}
      {tab === 'requests' && (
        filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <ClipboardList className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">No project requests yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Submit a request and our team will review it within 24–48 hours.</p>
            <Link to="/customer/request-project"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
              <PlusCircle size={15} /> Submit a Request
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map(r => (
              <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                      <ClipboardList className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3a5c]">{r.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{r.serviceType}{r.projectType ? ` · ${r.projectType}` : ''}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {r.location && <span className="flex items-center gap-1"><MapPin size={11} /> {r.location}</span>}
                        {r.budget && <span>Budget: {r.budget}</span>}
                        {r.timeline && <span>Timeline: {r.timeline}</span>}
                        <span><Calendar size={11} className="inline mr-1" />{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.description}</p>}
                      {r.adminNotes && (
                        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-1.5 mt-2">
                          <strong>Admin note:</strong> {r.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 capitalize ${statusColor[r.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[r.status] || r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Projects tab */}
      {tab === 'projects' && (
        filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <HardHat className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">No projects assigned yet</p>
            <p className="text-gray-400 text-sm mt-1">Once your request is approved and work begins, your project will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(p => (
              <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c] rounded-lg flex items-center justify-center shrink-0">
                      <HardHat className="text-[#3b82f6]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3a5c]">{p.name || p.title}</h3>
                      {p.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {p.location}
                        </p>
                      )}
                      {p.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                        {p.startDate && <span className="flex items-center gap-1"><Calendar size={12} /> Start: {new Date(p.startDate).toLocaleDateString()}</span>}
                        {p.expectedCompletion && <span className="flex items-center gap-1"><Calendar size={12} /> End: {new Date(p.expectedCompletion).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                    <div className="mt-2 flex items-center gap-2 justify-end">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${p.progress >= 100 ? 'bg-green-500' : 'bg-[#1a3a5c]'}`}
                          style={{ width: `${p.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{p.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
