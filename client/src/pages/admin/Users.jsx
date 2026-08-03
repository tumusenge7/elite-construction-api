import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Loader2, Trash2, Plus } from 'lucide-react';

const empty = { firstName: '', lastName: '', email: '', password: '', phone: '' };

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetch_ = () => {
    setLoading(true);
    fetch(API_BASE_URL + '/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => setItems(j.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch_, [token]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    const res = await fetch(API_BASE_URL + '/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.success) { setError(json.message || 'Failed to create user'); setSaving(false); return; }
    setSaving(false); setModal(false); setForm(empty); fetch_();
  };

  const del = async (id) => {
    if (!confirm('Delete this user?')) return;
    await fetch(API_BASE_URL + `/api/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetch_();
  };

  const getRoleLabel = (u) => {
    if (!u.role) return '—';
    if (typeof u.role === 'string') return u.role;
    return u.role?.name || u.role?.roleName || '—';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Users</h1>
        <button onClick={() => { setForm(empty); setError(''); setModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus size={16} /> Add User
        </button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Name', 'Email', 'Role', 'Status', 'Created', ''].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                : items.map(u => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{getRoleLabel(u)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => del(u._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-[#1a3a5c]">Add User</h2>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
                  <div key={k}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                    <input required value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                ))}
              </div>
              {[['email','Email','email'],['password','Password','password'],['phone','Phone','tel']].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input required={k !== 'phone'} type={t} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <p className="text-xs text-gray-400">Role can be assigned from the user's profile after creation.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
