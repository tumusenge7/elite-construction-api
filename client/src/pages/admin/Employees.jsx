import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Plus, Briefcase, Loader2, Edit3, Trash2, X } from 'lucide-react';
import { crud } from '../../services/api';

export default function AdminEmployees() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const api = useMemo(() => crud('employees'), []);

  const fetchData = useCallback(async () => {
    try { const res = await api.list({ limit: 100 }); setData(res.data.data || []); } catch {} finally { setLoading(false); }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = data.filter(e =>
    `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (e.employeeCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.position || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      if (modal._id) {
        await api.update(modal._id, form);
      } else {
        await api.create(form);
      }
      setModal(null);
      fetchData();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this employee?')) {
      try { await api.delete(id); fetchData(); } catch {}
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#3b82f6]" size={36} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Employees</h1>
          <p className="text-gray-500 text-sm">{data.length} employees</p>
        </div>
        <button onClick={() => setModal({})} className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#1a3a5c]/90">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Position</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Department</th>
                <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id} className="border-t border-gray-100 hover:bg-[#3b82f6]/5 transition-all cursor-default">
                  <td className="px-4 py-3 font-medium text-[#1a3a5c]">{e.employeeCode || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#1a3a5c] rounded-full flex items-center justify-center text-white text-xs font-bold">{(e.firstName || '?').charAt(0)}</div>
                      <span className="font-medium text-[#1a3a5c]">{e.firstName || ''} {e.lastName || ''}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{e.position || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{e.department || '-'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${e.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{e.status || 'active'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(e)} className="p-1.5 text-gray-400 hover:text-[#3b82f6] rounded-lg hover:bg-gray-100 transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(e._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <Briefcase className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 text-sm">No employees found</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <EmployeeForm employee={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function EmployeeForm({ employee, onSave, onClose }) {
  const [form, setForm] = useState({
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    position: employee.position || '',
    department: employee.department || '',
    employeeCode: employee.employeeCode || '',
    status: employee.status || 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!employee._id) form.user = user.id;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a3a5c]">{employee._id ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
              <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Employee Code</label>
            <input value={form.employeeCode} onChange={e => setForm({...form, employeeCode: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
              <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
                <option value="">Select</option>
                <option value="Management">Management</option>
                <option value="Engineering">Engineering</option>
                <option value="Construction">Construction</option>
                <option value="Finance">Finance</option>
                <option value="Procurement">Procurement</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3b82f6] text-sm bg-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3a5c]/90 transition-all">{employee._id ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
