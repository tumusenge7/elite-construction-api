import { useState } from 'react';
import { Link } from 'react-router-dom';

const serviceOptions = [
  'Residential Construction', 'Commercial Construction', 'Renovation & Remodeling',
  'Design & Engineering', 'Infrastructure', 'Project Management', 'Other',
];

export default function RequestQuote() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', projectType: '',
    location: '', budget: '', timeline: '', description: '', howHeard: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Quote Request Submitted!</h1>
          <p className="text-gray-600 mb-6">Thank you for your interest. Our team will review your project details and get back to you within 24-48 hours.</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-left text-sm text-gray-600">
            <p><strong>Reference:</strong> REQ-{Date.now().toString(36).toUpperCase()}</p>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Service:</strong> {form.service}</p>
            <p><strong>Budget Range:</strong> {form.budget}</p>
          </div>
          <Link to="/" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold">Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Get Started</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Request a Quote</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Tell us about your project for a free, no-obligation estimate within 48 hours.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                <span className={`text-sm hidden sm:inline ${step >= s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Project Details' : s === 2 ? 'Contact Info' : 'Review'}
                </span>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                    <select name="service" required value={form.service} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                      <option value="">Select a service...</option>
                      {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <input type="text" name="projectType" value={form.projectType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. New build, renovation" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Location *</label>
                      <input type="text" name="location" required value={form.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="District, City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range *</label>
                      <select name="budget" required value={form.budget} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select budget...</option>
                        <option value="Under $50,000">Under $50,000</option>
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                        <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                        <option value="$500,000 - $1M">$500,000 - $1M</option>
                        <option value="Over $1M">Over $1M</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Timeline</label>
                      <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="Over 1 year">Over 1 year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear?</label>
                      <select name="howHeard" value={form.howHeard} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                    <textarea name="description" required rows={4} value={form.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="Describe your project..." />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button type="button" onClick={() => setStep(2)} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800">Next Step</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="+250 7XX XXX XXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="Company name" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 text-gray-700 font-medium">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800">Review & Submit</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Request</h2>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-500">Service Type</p><p className="font-medium text-gray-900">{form.service}</p></div>
                    <div><p className="text-sm text-gray-500">Location</p><p className="font-medium text-gray-900">{form.location}</p></div>
                    <div><p className="text-sm text-gray-500">Budget</p><p className="font-medium text-gray-900">{form.budget}</p></div>
                    <div><p className="text-sm text-gray-500">Timeline</p><p className="font-medium text-gray-900">{form.timeline || 'Not specified'}</p></div>
                    <div className="sm:col-span-2"><p className="text-sm text-gray-500">Description</p><p className="font-medium text-gray-900">{form.description}</p></div>
                    <div><p className="text-sm text-gray-500">Name</p><p className="font-medium text-gray-900">{form.name}</p></div>
                    <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">{form.email}</p></div>
                    <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-900">{form.phone}</p></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 text-gray-700 font-medium">Back</button>
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
