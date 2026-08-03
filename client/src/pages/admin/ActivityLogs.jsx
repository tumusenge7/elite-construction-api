import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, RefreshCw, Monitor, Users, TrendingUp } from 'lucide-react';

const EVENT_TYPES = ['', 'page_view', 'api_request', 'click', 'login', 'logout', 'error'];

const eventBadge = {
  page_view: 'bg-blue-50 text-blue-700',
  api_request: 'bg-purple-50 text-purple-700',
  click: 'bg-green-50 text-green-700',
  login: 'bg-teal-50 text-teal-700',
  logout: 'bg-gray-100 text-gray-500',
  error: 'bg-red-50 text-red-700',
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalVisits: 0, activeToday: 0, topPath: '—' });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ eventType: '', path: '', dateFrom: '', dateTo: '' });
  const token = localStorage.getItem('token');

  const fetch_ = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (filters.eventType) params.set('eventType', filters.eventType);
    if (filters.path) params.set('path', filters.path);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);

    try {
      const res = await fetch(`/api/activity-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
        setPagination(json.pagination);
        setStats(json.stats || {});
      }
    } catch {}
    setLoading(false);
  }, [filters, token]);

  useEffect(() => { fetch_(1); }, [fetch_]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetch_(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Activity Logs</h1>
        <button onClick={() => fetch_(pagination.page)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded-lg">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Page Views', value: stats.totalVisits?.toLocaleString() || 0, icon: Monitor, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active Users Today', value: stats.activeToday || 0, icon: Users, color: 'text-green-600 bg-green-50' },
          { label: 'Most Visited Page', value: stats.topPath || '—', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-gray-800 truncate max-w-[160px]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label>
            <select value={filters.eventType} onChange={e => setFilters(f => ({ ...f, eventType: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Path</label>
            <input value={filters.path} onChange={e => setFilters(f => ({ ...f, path: e.target.value }))}
              placeholder="/admin/projects"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <button type="submit" className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Search size={14} /> Apply Filters
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['User', 'Event', 'Path', 'Method', 'Status', 'IP Address', 'Duration', 'Time'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">No activity logs found</td></tr>
                  ) : logs.map(log => (
                    <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-xs">{log.userEmail || 'Guest'}</p>
                        {log.userRole && <p className="text-gray-400 text-[10px]">{log.userRole}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eventBadge[log.eventType] || 'bg-gray-100 text-gray-500'}`}>
                          {log.eventType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate text-xs">{log.path}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{log.method || '—'}</td>
                      <td className="px-4 py-3">
                        {log.statusCode ? (
                          <span className={`text-xs font-semibold ${log.statusCode < 300 ? 'text-green-600' : log.statusCode < 500 ? 'text-amber-600' : 'text-red-600'}`}>
                            {log.statusCode}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{log.ipAddress || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{log.duration != null ? `${log.duration}ms` : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing {((pagination.page - 1) * 20) + 1}–{Math.min(pagination.page * 20, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button disabled={pagination.page <= 1} onClick={() => fetch_(pagination.page - 1)}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-xs text-gray-600">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetch_(pagination.page + 1)}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
