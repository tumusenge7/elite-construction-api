import { useState } from 'react';
import { CheckCircle, PlusCircle, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICE_TYPES = [
  'Residential Construction', 'Commercial Construction', 'Renovation & Remodeling',
  'Design & Engineering', 'Infrastructure', 'Project Management', 'Other',
];

const BUDGETS = [
  'Under $50,000', '$50,000 – $100,000', '$100,000 – $250,000',
  '$250,000 – $500,000', '$500,000 – $1M', 'Over $1M', 'Not sure',
];

const TIMELINES = ['ASAP', '1–3 months', '3–6 months', '6–12 months', 'Over 1 year', 'Flexible'];

export default function CustomerRequestProject() {
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    title: '', serviceType: '', projectType: '', location: '',
    budget: '', timeline: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Submission failed');
      setInvoice(json.data?.invoice || null);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2">Request Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Our team will review your project request and get back to you within 24–48 hours.
        </p>
        {invoice && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-left">
            <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-2">Invoice Generated</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Invoice #{invoice.invoiceNumber}</span>
              <span className="text-sm font-bold text-[#1a3a5c]">{invoice.total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your invoice was generated automatically and sent to your registered email address. The email contains a secure payment link showing all available payment methods — Visa, Mobile Money, Airtel Money, bank transfer, and more.
            </p>
            <a
              href={`/pay/${invoice.invoiceNumber}`}
              className="mt-4 inline-flex items-center justify-center w-full bg-[#1a3a5c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a5a8c]"
            >
              Pay Now
            </a>
          </div>
        )}
        <div className="flex justify-center gap-3">
          <button onClick={() => { setSubmitted(false); setForm({ title: '', serviceType: '', projectType: '', location: '', budget: '', timeline: '', description: '' }); }}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            <PlusCircle size={16} /> New Request
          </button>
          <Link to="/customer/projects"
            className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a5a8c]">
            View My Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Request a Project</h1>
        <p className="text-gray-500 text-sm">Fill in the details below and our team will review your request.</p>
        <div className="mt-4 flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-relaxed">
            Upon submission, the system <strong>automatically generates an invoice</strong> and <strong>emails it to your registered email address</strong>. The email includes a <strong>secure payment link</strong> showing all available payment methods — <strong>Visa, Mobile Money, bank transfer, and more</strong> — all created automatically by the system.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input
            type="text" required value={form.title} onChange={set('title')}
            placeholder="e.g. 3-bedroom house construction in Kigali"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select required value={form.serviceType} onChange={set('serviceType')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select service...</option>
              {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
            <input
              type="text" value={form.projectType} onChange={set('projectType')}
              placeholder="e.g. New build, renovation"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text" required value={form.location} onChange={set('location')}
            placeholder="District, City"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
            <select value={form.budget} onChange={set('budget')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select budget...</option>
              {BUDGETS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Timeline</label>
            <select value={form.timeline} onChange={set('timeline')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select timeline...</option>
              {TIMELINES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
          <textarea
            required rows={5} value={form.description} onChange={set('description')}
            placeholder="Describe your project in detail — size, materials, special requirements, etc."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
