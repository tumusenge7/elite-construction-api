import { useState } from 'react';
import { Search, HardHat, MapPin, Calendar } from 'lucide-react';

const myProjects = [
  { id: '#P001', name: 'Skyline Tower', status: 'In Progress', progress: 75, location: 'Kacyiru, Kigali', startDate: 'Jan 2025', deadline: 'Dec 2026', description: 'Commercial office tower construction' },
  { id: '#P002', name: 'Green Valley Estate', status: 'In Progress', progress: 60, location: 'Kanombe, Kigali', startDate: 'Mar 2025', deadline: 'Mar 2027', description: 'Luxury villa development' },
  { id: '#P003', name: 'Riverside Mall', status: 'Completed', progress: 100, location: 'Nyarutarama, Kigali', startDate: 'Jun 2024', deadline: 'Jun 2026', description: 'Shopping mall construction' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

export default function CustomerProjects() {
  const [search, setSearch] = useState('');

  const filtered = myProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Projects</h1>
        <p className="text-gray-500 text-sm">Track the progress of your construction projects</p>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((p, i) => (
          <div key={p.id} variants={cardAnim} whileHover={{ y: -3, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.1)' }} className="bg-white rounded-xl border border-gray-200 p-5 cursor-default">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div whileHover={{ rotate: 10, scale: 1.05 }} className="w-10 h-10 bg-gradient-to-br from-[#1a3a5c] to-[#2a5a8c] rounded-lg flex items-center justify-center shrink-0">
                  <HardHat className="text-[#3b82f6]" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a3a5c]">{p.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {p.location}</p>
                  <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Start: {p.startDate}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Deadline: {p.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${p.progress === 100 ? 'bg-green-500' : 'bg-[#1a3a5c]'}`} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{p.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <HardHat className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-500 text-sm">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
