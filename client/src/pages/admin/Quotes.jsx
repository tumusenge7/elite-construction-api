import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Loader2, X, Edit3, Trash2 } from 'lucide-react';
import { crud } from '../../services/api';

const quotesApi = crud('quotes');

const statusColors = {
  draft: 'bg-gray-100 text-gray-500',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700',
  revised: 'bg-amber-100 text-amber-700',
};

const defaultForm = {
  title: '', clientName: '', projectName: '', totalAmount: '', status: 'draft', notes: '',
};

export default function AdminQuotes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try { const res = await quotesApi.list({ limit: 100 }); setData(res.data.data || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(q =>
    [q.title, q.clientName, q.projectName].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal._id) await quotesApi.update(modal._id, form);
      else await quotesApi.create(form);
      setModal(null); fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quote.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quote?')) return;
    try { await quotesApi.delete(id); fetchData(); } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-500 text-sm">{data.length} quotations</p>
        </div>
        <button onClick={() => setModal(defaultForm)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800">
          <Plus size={18} /> New Quote
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search quotes..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Client</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Project</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{q.title || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{q.clientName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{q.projectName || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{q.totalAmount ? `$${Number(q.totalAmount).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[q.status] || 'bg-gray-100 text-gray-500'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(q)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(q._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No quotes found</p>
            </div>
          )}
        </div>
      </div>

      {modal && <QuoteForm quote={modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />}
    </div>
  );
}

function QuoteForm({ quote, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    title: quote.title || '',
    clientName: quote.clientName || '',
    projectName: quote.projectName || '',
    totalAmount: quote.totalAmount || '',
    status: quote.status || 'draft',
    notes: quote.notes || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{quote._id ? 'Edit Quote' : 'New Quote'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
              <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Name</label>
              <input value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Amount ($)</label>
              <input type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm bg-white">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="revised">Revised</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving...' : quote._id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
