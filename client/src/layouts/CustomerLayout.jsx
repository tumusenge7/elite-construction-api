import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Receipt, LogOut, Menu, X, Bell, UserCircle, PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { name: 'Dashboard', path: '/customer', icon: LayoutDashboard },
  { name: 'My Projects', path: '/customer/projects', icon: HardHat },
  { name: 'Request Project', path: '/customer/request-project', icon: PlusCircle },
  { name: 'My Quotes', path: '/customer/quotes', icon: FileText },
  { name: 'Invoices', path: '/customer/invoices', icon: Receipt },
  { name: 'My Profile', path: '/customer/profile', icon: UserCircle },
];

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // While auth is loading, show nothing
  if (loading) return null;

  // Not logged in — redirect to login with the intended path
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}&reason=auth_required`} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <span className="text-white font-semibold">My Account</span>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/customer'}
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
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-[#1a3a5c]">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#1a3a5c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(user?.first_name || user?.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.name || 'Customer')}
                </p>
                <p className="text-xs text-gray-500">Customer</p>
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
