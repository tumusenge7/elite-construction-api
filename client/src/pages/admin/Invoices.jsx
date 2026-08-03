import { useState, useEffect } from 'react';
import { Search, Plus, Receipt, Loader2, X, Edit3, Trash2 } from 'lucide-react';
import { crud } from '../../services/api';

const invoicesApi = crud('invoices');

const statusColors = {
  draft: 'bg-gray-100 text-gray-500',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  partially_paid: 'bg-teal-100 text-teal-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-orange-100 text-orange-700',
};

const defaultForm = {
  invoiceNumber: '', clientName: '', projectName: '', totalAmount: '', status: 'draft', dueDate: '', notes: '',
};

export default function AdminInvoices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try { const res = await invoicesApi.list({ limit: 100 }); setData(res.data.data || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(inv =>
    [inv.invoiceNumber, inv.clientName, inv.projectName].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal._id) await invoicesApi.update(modal._id, form);
      else await invoicesApi.create(form);
      setModal(null); fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save invoice.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    try { await invoicesApi.delete(id); fetchData(); } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm">{data.length} invoices</p>
        </div>
        <button onClick={() => setModal(defaultForm)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800">
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Project</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Due Date</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNumber || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Receipt className="text-gray-400" size={14} />
                      </div>
                      <span className="font-medium text-gray-900">{inv.clientName || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{inv.projectName || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.totalAmount ? `$${Number(inv.totalAmount).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status] || 'bg-gray-100 text-gray-500'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(inv)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(inv._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Receipt className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No invoices found</p>
            </div>
          )}
        </div>
      </div>

      {modal && <InvoiceForm invoice={modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />}
    </div>
  );
}

function InvoiceForm({ invoice, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    invoiceNumber: invoice.invoiceNumber || '',
    clientName: invoice.clientName || '',
    projectName: invoice.projectName || '',
    totalAmount: invoice.totalAmount || '',
    status: invoice.status || 'draft',
    dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : '',
    notes: invoice.notes || '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{invoice._id ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number</label>
              <input value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" placeholder="INV-001" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm bg-white">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm" />
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
              {saving ? 'Saving...' : invoice._id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
