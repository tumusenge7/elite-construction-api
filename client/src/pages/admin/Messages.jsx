import { useState, useEffect, useCallback } from 'react';
import { Mail, MailOpen, Trash2, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? { is_read: false } : filter === 'read' ? { is_read: true } : {};
      const res = await api.get('/contact', { params: { ...params, limit: 100 } });
      setMessages(res.data.data || []);
    } catch {} finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (msg) => {
    if (msg.isRead) return;
    try {
      await api.put(`/contact/${msg._id}/read`);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      if (selected?._id === msg._id) setSelected({ ...selected, isRead: true });
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {}
  };

  const openMessage = (msg) => {
    setSelected(msg);
    markRead(msg);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Contact Messages</h1>
          <p className="text-gray-500 text-sm">{unreadCount} unread · {messages.length} total</p>
        </div>
        <button onClick={fetchMessages} className="p-2 text-gray-400 hover:text-[#1a3a5c] rounded-lg hover:bg-gray-100 transition-all">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === val ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-[#3b82f6]" size={28} />
            </div>
          ) : messages.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquare className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No messages</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${selected?._id === msg._id ? 'bg-blue-50 border-l-2 border-l-[#3b82f6]' : ''} ${!msg.isRead ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.isRead ? <MailOpen size={16} className="text-gray-400 flex-shrink-0" /> : <Mail size={16} className="text-[#3b82f6] flex-shrink-0" />}
                    <span className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-[#1a3a5c]' : 'text-gray-700'}`}>{msg.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate ml-6">{msg.subject || msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1a3a5c]">{selected.subject || '(No Subject)'}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteMsg(selected._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-16">From:</span>
                  <span className="font-medium text-gray-900">{selected.name}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-16">Email:</span>
                  <a href={`mailto:${selected.email}`} className="text-[#3b82f6] hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex gap-3 text-sm">
                    <span className="text-gray-500 w-16">Phone:</span>
                    <a href={`tel:${selected.phone}`} className="text-[#3b82f6] hover:underline">{selected.phone}</a>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your Inquiry')}&body=Dear ${encodeURIComponent(selected.name)},%0A%0A`}
                className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a3a5c]/90 transition-all"
              >
                <Mail size={16} /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <MessageSquare className="text-gray-200 mb-3" size={56} />
              <p className="text-gray-400 text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
