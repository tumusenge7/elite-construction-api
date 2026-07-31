import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, Loader2, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { notifications as notificationsApi, crud } from '../../services/api';

const TYPE_ICONS = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  reminder: Clock,
};

const TYPE_COLORS = {
  info: 'text-blue-500 bg-blue-50',
  warning: 'text-amber-500 bg-amber-50',
  success: 'text-emerald-500 bg-emerald-50',
  reminder: 'text-purple-500 bg-purple-50',
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = crud('notifications');

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationsApi.mine({ limit: 50 });
      setNotifications(data.data || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    } catch {}
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#3b82f6]" size={36} />
      </div>
    );
  }

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Notifications</h1>
          <p className="text-gray-500 text-sm">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg hover:bg-[#1a3a5c]/90 transition-all text-sm font-medium">
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const TypeIcon = TYPE_ICONS[n.type] || Bell;
            const colorClass = TYPE_COLORS[n.type] || 'text-gray-500 bg-gray-50';
            return (
              <div
                key={n._id}
                className={`bg-white rounded-xl border ${n.isRead ? 'border-gray-200' : 'border-[#3b82f6]/30 bg-[#3b82f6]/5'} p-4 flex items-start gap-4 transition-all`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                  <TypeIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-medium ${n.isRead ? 'text-gray-600' : 'text-[#1a3a5c]'}`}>{n.title}</p>
                      {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.isRead && (
                        <button onClick={() => markRead(n._id)} className="p-1.5 text-gray-400 hover:text-[#3b82f6] transition-all" title="Mark read">
                          <CheckCheck size={14} />
                        </button>
                      )}
                      <button onClick={() => deleteNotif(n._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
