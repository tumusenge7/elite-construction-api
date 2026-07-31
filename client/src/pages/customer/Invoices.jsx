import { useState } from 'react';
import { Search, Receipt, Download, Eye } from 'lucide-react';

const myInvoices = [
  { id: '#INV-001', project: 'Skyline Tower', amount: '$1,200,000', status: 'Paid', dueDate: '2026-07-15', issued: '2026-06-15' },
  { id: '#INV-002', project: 'Green Valley Estate', amount: '$850,000', status: 'Pending', dueDate: '2026-08-01', issued: '2026-07-01' },
  { id: '#INV-003', project: 'Riverside Mall', amount: '$2,100,000', status: 'Paid', dueDate: '2026-06-30', issued: '2026-05-31' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

const statusColors = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
};

export default function CustomerInvoices() {
  const [search, setSearch] = useState('');

  const filtered = myInvoices.filter(inv =>
    inv.project.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Invoices</h1>
        <p className="text-gray-500 text-sm">View and download your invoices</p>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((inv, i) => (
          <div key={inv.id} variants={cardAnim} whileHover={{ y: -3, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.1)' }} className="bg-white rounded-xl border border-gray-200 p-5 cursor-default">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div whileHover={{ rotate: 10 }} className="w-10 h-10 bg-[#1a3a5c]/5 rounded-lg flex items-center justify-center shrink-0">
                  <Receipt className="text-[#1a3a5c]" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a3a5c]">{inv.project}</h3>
                  <p className="text-sm text-gray-500">{inv.id} &bull; Issued: {inv.issued}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Due: {inv.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-[#1a3a5c]">{inv.amount}</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status] || ''}`}>{inv.status}</span>
                </div>
                <div className="flex gap-2">
                  <button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-[#1a3a5c] border border-gray-200 rounded-lg hover:border-[#1a3a5c] transition-all">
                    <Eye size={18} />
                  </button>
                  <button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-[#1a3a5c] border border-gray-200 rounded-lg hover:border-[#3b82f6] transition-all">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <Receipt className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-500 text-sm">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
}
