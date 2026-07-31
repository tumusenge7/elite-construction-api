import { HardHat, FileText, Receipt, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Projects', value: 2, icon: HardHat, color: 'bg-blue-500' },
  { label: 'Pending Quotes', value: 1, icon: FileText, color: 'bg-amber-500' },
  { label: 'Unpaid Invoices', value: 1, icon: Receipt, color: 'bg-red-500' },
  { label: 'Completed Projects', value: 1, icon: Clock, color: 'bg-green-500' },
];

const recentActivities = [
  { text: 'Quote #Q002 has been approved', time: '2 days ago', type: 'success' },
  { text: 'Green Valley Estate - progress update: 60% complete', time: '3 days ago', type: 'info' },
  { text: 'Invoice #INV-003 is due in 15 days', time: '5 days ago', type: 'warning' },
  { text: 'Site visit scheduled for Skyline Tower', time: '1 week ago', type: 'info' },
];

export default function CustomerDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">My Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here is an overview of your projects.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="text-white" size={20} />
            </div>
            <p className="text-2xl font-bold text-[#1a3a5c]">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a3a5c] mb-4">My Projects</h2>
          <div className="space-y-3">
            <Link to="/customer/projects" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div><p className="font-medium text-[#1a3a5c] text-sm">Skyline Tower</p><p className="text-xs text-gray-500">Progress: 75%</p></div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#3b82f6] transition-colors" />
            </Link>
            <Link to="/customer/projects" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div><p className="font-medium text-[#1a3a5c] text-sm">Green Valley Estate</p><p className="text-xs text-gray-500">Progress: 60%</p></div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#3b82f6] transition-colors" />
            </Link>
            <Link to="/customer/projects" className="block text-center text-sm text-[#3b82f6] font-medium mt-2 hover:underline">View All Projects</Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a3a5c] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div>
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
