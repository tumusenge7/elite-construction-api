import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Smartphone, Shield, Trash2, Loader2 } from 'lucide-react';
import { crud } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: 'Elite Construction',
    contact_email: 'info@eliteconstruction.com',
    contact_phone: '+250 788 000 000',
    contact_address: 'KG 123 Ave, Kacyiru, Kigali',
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const api = crud('settings');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, sessRes] = await Promise.all([
          api.list({ limit: 50 }),
          fetch('/api/sessions/mine', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(r => r.json()),
        ]);
        const items = sRes.data.data || [];
        const map = {};
        items.forEach(s => { map[s.settingKey] = s.settingValue; });
        setSettings(prev => ({ ...prev, ...map }));
        if (sessRes.success) setSessions(sessRes.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.update(null, { settingKey: key, settingValue: value });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {} finally { setSaving(false); }
  };

  const terminateSession = async (id) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3b82f6]" size={36} /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Settings</h1>
        <p className="text-gray-500 text-sm">Manage system configuration</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a3a5c] mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input name="site_name" value={settings.site_name || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="contact_email" value={settings.contact_email || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input name="contact_address" value={settings.contact_address || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a3a5c]">Active Sessions</h2>
            <Shield size={20} className="text-gray-400" />
          </div>
          {sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-[#1a3a5c]">{s.device || 'Unknown device'}</p>
                      <p className="text-xs text-gray-500">{s.ipAddress || 'N/A'} · {new Date(s.lastActivity).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => terminateSession(s._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving} className="bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all hover:bg-[#1a3a5c]/90">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
