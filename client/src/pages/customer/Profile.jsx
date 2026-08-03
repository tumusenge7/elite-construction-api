import { useState } from 'react';
import { User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Alert({ type, msg }) {
  if (!msg) return null;
  const styles = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-red-50 border-red-200 text-red-700';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`flex items-center gap-2 border px-4 py-3 rounded-lg text-sm mb-4 ${styles}`}>
      <Icon size={16} className="shrink-0" /> {msg}
    </div>
  );
}

export default function CustomerProfile() {
  const { user, updateUser } = useAuth();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [profileStatus, setProfileStatus] = useState({ loading: false, success: '', error: '' });

  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ loading: false, success: '', error: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ loading: true, success: '', error: '' });
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Update failed');
      updateUser({ first_name: profile.first_name, last_name: profile.last_name, phone: profile.phone });
      setProfileStatus({ loading: false, success: 'Profile updated successfully.', error: '' });
    } catch (err) {
      setProfileStatus({ loading: false, success: '', error: err.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm) {
      setPwStatus({ loading: false, success: '', error: 'New passwords do not match.' });
      return;
    }
    if (passwords.new_password.length < 8) {
      setPwStatus({ loading: false, success: '', error: 'New password must be at least 8 characters.' });
      return;
    }
    setPwStatus({ loading: true, success: '', error: '' });
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: passwords.current_password, new_password: passwords.new_password }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Password change failed');
      setPasswords({ current_password: '', new_password: '', confirm: '' });
      setPwStatus({ loading: false, success: 'Password changed successfully.', error: '' });
    } catch (err) {
      setPwStatus({ loading: false, success: '', error: err.message });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Profile</h1>
        <p className="text-gray-500 text-sm">Update your account information and password.</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-[#1a3a5c]">Personal Information</h2>
        </div>

        <Alert type="success" msg={profileStatus.success} />
        <Alert type="error" msg={profileStatus.error} />

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text" required value={profile.first_name}
                onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text" required value={profile.last_name}
                onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={user?.email || ''} disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel" value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="+250 7XX XXX XXX"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={profileStatus.loading}
              className="flex items-center gap-2 bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2a5a8c] disabled:opacity-50 text-sm">
              {profileStatus.loading && <Loader2 size={15} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
            <Lock size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-[#1a3a5c]">Change Password</h2>
        </div>

        <Alert type="success" msg={pwStatus.success} />
        <Alert type="error" msg={pwStatus.error} />

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password" required value={passwords.current_password}
              onChange={e => setPasswords(p => ({ ...p, current_password: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password" required value={passwords.new_password}
                onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password" required value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none ${
                  passwords.confirm && passwords.confirm !== passwords.new_password
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Repeat new password"
              />
              {passwords.confirm && passwords.confirm !== passwords.new_password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={pwStatus.loading}
              className="flex items-center gap-2 bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2a5a8c] disabled:opacity-50 text-sm">
              {pwStatus.loading && <Loader2 size={15} className="animate-spin" />}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
