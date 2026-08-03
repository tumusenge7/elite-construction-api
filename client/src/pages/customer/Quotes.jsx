import { useState } from 'react';
import { Search, FileText, Eye } from 'lucide-react';

const myQuotes = [
  { id: '#Q001', project: 'Office Renovation', amount: '$150,000', status: 'Pending', date: '2026-07-25', validUntil: '2026-08-25' },
  { id: '#Q002', project: 'Home Extension', amount: '$85,000', status: 'Approved', date: '2026-07-22', validUntil: '2026-08-22' },
];

const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function CustomerQuotes() {
  const [search, setSearch] = useState('');

  const filtered = myQuotes.filter(q =>
    q.project.toLowerCase().includes(search.toLowerCase()) ||
    q.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Quotes</h1>
        <p className="text-gray-500 text-sm">View and manage your project quotations</p>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search quotes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q) => (
          <div key={q.id} variants={cardAnim} whileHover={{ y: -3, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.1)' }} className="bg-white rounded-xl border border-gray-200 p-5 cursor-default">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="text-[#3b82f6]" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a3a5c]">{q.project}</h3>
                  <p className="text-sm text-gray-500">{q.id} &bull; Issued: {q.date}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Valid until: {q.validUntil}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-[#1a3a5c]">{q.amount}</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[q.status] || ''}`}>{q.status}</span>
                </div>
                <button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-[#1a3a5c] hover:bg-[#1a3a5c]/5 border border-gray-200 rounded-lg hover:border-[#1a3a5c] transition-all">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <FileText className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-500 text-sm">No quotes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
