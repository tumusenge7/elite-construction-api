import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { HardHat, FileText, Receipt, Clock, ArrowRight, Loader2, PlusCircle, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(API_BASE_URL + '/api/projects', { headers }).then(r => r.json()),
      fetch(API_BASE_URL + '/api/project-requests', { headers }).then(r => r.json()),
      fetch(API_BASE_URL + '/api/quotes', { headers }).then(r => r.json()),
      fetch(API_BASE_URL + '/api/invoices', { headers }).then(r => r.json()),
    ]).then(([p, pr, q, i]) => {
      setProjects(p.data || []);
      setRequests(pr.data || []);
      setQuotes(q.data || []);
      setInvoices(i.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled');
  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'reviewing');
  const pendingQuotes = quotes.filter(q => q.status === 'draft' || q.status === 'sent' || q.status === 'viewed');
  const unpaidInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const stats = [
    { label: 'Active Projects', value: activeProjects.length, icon: HardHat, color: 'bg-blue-500' },
    { label: 'Pending Requests', value: pendingRequests.length, icon: ClipboardList, color: 'bg-purple-500' },
    { label: 'Pending Quotes', value: pendingQuotes.length, icon: FileText, color: 'bg-amber-500' },
    { label: 'Unpaid Invoices', value: unpaidInvoices.length, icon: Receipt, color: 'bg-red-500' },
  ];

  const requestStatusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewing: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    converted: 'bg-purple-100 text-purple-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, <strong>{user?.first_name || user?.name || 'there'}</strong>! Here is an overview of your projects.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <Link to="/customer/request-project"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 text-sm">
          <PlusCircle size={16} /> Request a New Project
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="text-white" size={20} />
            </div>
            <p className="text-2xl font-bold text-[#1a3a5c]">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a3a5c]">My Project Requests</h2>
            <Link to="/customer/request-project" className="text-xs text-blue-600 hover:underline font-medium">+ New</Link>
          </div>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm">No requests yet.</p>
              <Link to="/customer/request-project" className="text-blue-600 text-sm hover:underline mt-1 inline-block">Submit your first request</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 4).map(r => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1a3a5c] text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.serviceType} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${requestStatusColor[r.status] || 'bg-gray-100 text-gray-600'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a3a5c] mb-4">My Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <HardHat className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm">No projects yet. Projects appear here once our team assigns them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 3).map(p => (
                <Link key={p._id} to="/customer/projects"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div>
                    <p className="font-medium text-[#1a3a5c] text-sm">{p.name || p.title}</p>
                    <p className="text-xs text-gray-500">Progress: {p.progress || 0}%</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#3b82f6] transition-colors" />
                </Link>
              ))}
              <Link to="/customer/projects" className="block text-center text-sm text-[#3b82f6] font-medium mt-2 hover:underline">
                View All Projects
              </Link>
            </div>
          )}
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a3a5c] mb-4">Recent Quotes</h2>
          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm">No quotes yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.slice(0, 3).map(q => (
                <Link key={q._id} to="/customer/quotes"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div>
                    <p className="font-medium text-[#1a3a5c] text-sm">{q.title || q.projectName || `Quote #${q.quoteNumber || q._id?.slice(-6)}`}</p>
                    <p className="text-xs text-gray-500 capitalize">{q.status}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#3b82f6] transition-colors" />
                </Link>
              ))}
              <Link to="/customer/quotes" className="block text-center text-sm text-[#3b82f6] font-medium mt-2 hover:underline">
                View All Quotes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
