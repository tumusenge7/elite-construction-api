import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, HardHat, FileText, DollarSign, Bell, TrendingUp, Activity, ArrowUpRight, Loader2, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { analytics } from '../../services/api';

const COLORS = ['#3b82f6', '#1a3a5c', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ label, value, change, icon: Icon, color, delay }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="text-white" size={20} />
        </div>
        {change != null && (
          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
            {change} <ArrowUpRight size={12} />
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#1a3a5c]">{value ?? '-'}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children, delay = 0 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[#1a3a5c]">{title}</h2>
        {Icon && <Icon size={20} className="text-gray-400" />}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 text-sm">
        <p className="font-medium text-[#1a3a5c]">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
}

const CONTACT_STATS = [
  { month: 'Jan', messages: 4 },
  { month: 'Feb', messages: 7 },
  { month: 'Mar', messages: 5 },
  { month: 'Apr', messages: 12 },
  { month: 'May', messages: 9 },
  { month: 'Jun', messages: 15 },
  { month: 'Jul', messages: 11 },
  { month: 'Aug', messages: 18 },
];

const PROJECT_PROGRESS = [
  { month: 'Jan', budget: 120, actual: 110 },
  { month: 'Feb', budget: 180, actual: 175 },
  { month: 'Mar', budget: 150, actual: 160 },
  { month: 'Apr', budget: 200, actual: 190 },
  { month: 'May', budget: 220, actual: 215 },
  { month: 'Jun', budget: 260, actual: 250 },
  { month: 'Jul', budget: 300, actual: 280 },
  { month: 'Aug', budget: 340, actual: 330 },
];

export default function AdminDashboard() {
  // ALL hooks must be declared before any early return
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [quotesData, setQuotesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [showAddVideo, setShowAddVideo] = useState(false);

  useEffect(() => {
    Promise.all([
      analytics.dashboard(),
      analytics.revenueByMonth(),
      analytics.projectsByStatus(),
      analytics.quotesByMonth(),
      analytics.serviceDemand(),
    ]).then(([d, r, s, q, sv]) => {
      setStats(d.data.data);
      setRevenueData(r.data.data || []);
      setStatusData(s.data.data || []);
      setQuotesData(q.data.data || []);
      setServiceData(sv.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/youtube/videos?limit=12')
      .then(r => r.json())
      .then(json => { if (json.success) setYoutubeVideos(json.data || []); })
      .catch(() => {})
      .finally(() => setYtLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#3b82f6]" size={36} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.total_customers, change: null, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Projects', value: stats?.active_projects, change: null, icon: HardHat, color: 'bg-emerald-500' },
    { label: 'Pending Quotes', value: stats?.pending_quotes, change: null, icon: FileText, color: 'bg-amber-500' },
    { label: 'Total Revenue', value: stats?.total_revenue != null ? `$${(stats.total_revenue / 1000).toFixed(1)}K` : null, change: null, icon: DollarSign, color: 'bg-purple-500' },
  ];

  const contactStats = CONTACT_STATS;
  const projectProgress = PROJECT_PROGRESS;

  const addVideo = () => {
    const match = newVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      setYoutubeVideos(prev => [...prev, { id: match[1], title: `Added video` }]);
      setNewVideoUrl('');
      setShowAddVideo(false);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back. Here is your project overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => <StatCard key={i} {...card} delay={i} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Revenue Trend" icon={TrendingUp}>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No revenue data yet</p>}
        </ChartCard>

        <ChartCard title="Projects by Status" icon={Activity}>
          {statusData.length > 0 ? (
            <div className="flex items-center justify-center h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="count" nameKey="status">
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 capitalize">{s.status?.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-[#1a3a5c]">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-12">No project data yet</p>}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Quotes Overview" icon={FileText}>
          {quotesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={quotesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Quotes" fill="#1a3a5c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" name="Value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No quote data yet</p>}
        </ChartCard>

        <ChartCard title="Service Demand" icon={TrendingUp}>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#9ca3af" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="project_count" name="Projects" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No service data yet</p>}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Quick Stats" icon={Activity}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Completed Projects', value: stats?.completed_projects },
              { label: 'Approved Quotes', value: stats?.approved_quotes },
              { label: 'Outstanding Invoices', value: stats?.outstanding_payments },
              { label: 'Unread Messages', value: stats?.unread_messages },
              { label: 'Upcoming Appointments', value: stats?.upcoming_appointments },
              { label: 'Unread Notifications', value: stats?.unread_notifications ?? 0 },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-[#1a3a5c]">{item.value ?? 0}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Quick Actions" icon={null}>
          <div className="space-y-3">
            <Link to="/admin/projects" className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-all text-sm font-medium text-[#1a3a5c]">➕ Create New Project</Link>
            <Link to="/admin/quotes" className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-all text-sm font-medium text-[#1a3a5c]">📄 Generate Quote</Link>
            <Link to="/admin/customers" className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-all text-sm font-medium text-[#1a3a5c]">👥 Manage Customers</Link>
            <Link to="/admin/invoices" className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#3b82f6] transition-all text-sm font-medium text-[#1a3a5c]">💰 View Invoices</Link>
          </div>
        </ChartCard>
      </div>

      {/* Extra Chart Row */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Contact Messages per Month" icon={MessageSquare}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={contactStats}>
              <defs>
                <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="messages" name="Messages" stroke="#3b82f6" strokeWidth={2} fill="url(#msgGrad)" dot={{ r: 4, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">Total this year: <span className="font-bold text-[#1a3a5c]">{contactStats.reduce((s, m) => s + m.messages, 0)}</span></span>
            <Link to="/admin/messages" className="text-[#3b82f6] hover:underline text-xs font-medium">View all messages →</Link>
          </div>
        </ChartCard>

        <ChartCard title="Budget vs Actual Spend ($K)" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${v}k`} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => `$${v}k`} />
              <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#1a3a5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#e2e8f0] inline-block" />Budget</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#1a3a5c] inline-block" />Actual</span>
          </div>
        </ChartCard>
      </div>

      {/* YouTube Channel Videos */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#1a3a5c]">Channel Highlights</h2>
            <p className="text-xs text-gray-400 mt-0.5">Auto-synced from YouTube channel</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.youtube.com/@blaisejavi" target="_blank" rel="noopener noreferrer"
              className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1">
              ▶ View Channel
            </a>
            <button onClick={() => setShowAddVideo(!showAddVideo)} className="text-sm text-blue-600 hover:underline">
              {showAddVideo ? 'Cancel' : '+ Add Video'}
            </button>
          </div>
        </div>

        {showAddVideo && (
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Paste YouTube URL to pin a video..." value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={addVideo} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Add</button>
          </div>
        )}

        {ytLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-[#3b82f6]" size={28} />
          </div>
        ) : youtubeVideos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">No videos found.</p>
            <p className="text-gray-400 text-xs mt-1">Add <code className="bg-gray-100 px-1 rounded">YOUTUBE_API_KEY</code> and <code className="bg-gray-100 px-1 rounded">YOUTUBE_CHANNEL_ID</code> to <code className="bg-gray-100 px-1 rounded">server/.env</code></p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {youtubeVideos.map((video, i) => (
              <div key={i} className="relative group">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
                </div>
                <button onClick={() => setYoutubeVideos(prev => prev.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  ✕
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">{video.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
