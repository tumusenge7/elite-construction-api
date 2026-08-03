import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, HardHat, FileText, Receipt, Settings, LogOut, Menu, X, Bell, BellRing, Search, Briefcase, MessageSquare, Grid, CheckCheck, Activity, Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Projects', path: '/admin/projects', icon: HardHat },
  { name: 'Quotes', path: '/admin/quotes', icon: FileText },
  { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
  { name: 'Employees', path: '/admin/employees', icon: Briefcase },
  { name: 'Services', path: '/admin/services', icon: Grid },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Notifications', path: '/admin/notifications', icon: BellRing },
  { name: 'Activity Logs', path: '/admin/activity-logs', icon: Activity },
  { name: 'All Things', path: '/admin/all-things', icon: Layers },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications/mine?limit=5', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const json = await res.json();
        if (json.success) setNotifs(json.data || []);
      } catch {}
    };
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const json = await res.json();
        if (json.success) setUnreadCount(json.data.count);
      } catch {}
    };
    fetchNotifs();
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch {} finally {
      logout();
      navigate('/login');
    }
  };

  const markNotifRead = async (n) => {
    try {
      await fetch(`/api/notifications/${n._id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotifs(prev => prev.map(x => (x._id === n._id ? { ...x, isRead: true } : x)));
      if (!n.isRead) setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  const markAllNotifsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotifs(prev => prev.map(x => ({ ...x, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a3a5c] transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center">
              <span className="text-[#1a3a5c] font-bold text-sm">E</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-[#3b82f6] text-[#1a3a5c]' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button className="lg:hidden p-2 text-gray-500 hover:text-[#1a3a5c]" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden sm:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-500 hover:text-[#1a3a5c] transition-all">
                {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-medium text-[#1a3a5c] text-sm">Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllNotifsRead} className="text-xs text-[#3b82f6] hover:underline flex items-center gap-1">
                          <CheckCheck size={13} /> Mark all read
                        </button>
                      )}
                      <button onClick={() => navigate('/admin/notifications')} className="text-xs text-[#3b82f6] hover:underline">View all</button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifs.map((n) => (
                        <button
                          key={n._id}
                          onClick={() => markNotifRead(n)}
                          className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-all ${!n.isRead ? 'bg-[#3b82f6]/5' : ''}`}
                        >
                          <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-[#1a3a5c] font-medium'}`}>{n.title}</p>
                          {n.message && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#1a3a5c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
