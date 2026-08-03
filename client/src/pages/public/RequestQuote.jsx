import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, LogIn, Copy, Check, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFieldValidation } from '../../hooks/useFieldValidation';

const serviceOptions = [
  'Residential Construction', 'Commercial Construction', 'Renovation & Remodeling',
  'Design & Engineering', 'Infrastructure', 'Project Management', 'Other',
];

function generatePassword(name) {
  const base = name.replace(/\s+/g, '').toLowerCase().slice(0, 6);
  return base + Math.floor(1000 + Math.random() * 9000);
}

export default function RequestQuote() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', projectType: '',
    location: '', budget: '', timeline: '', description: '', howHeard: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const emailValidation = useFieldValidation(form.email, 'email');
  const phoneValidation = useFieldValidation(form.phone, 'phone');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Submit quote request to API
      const quoteRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Quote Request: ${form.service}`,
          message: `Service: ${form.service}\nProject Type: ${form.projectType}\nLocation: ${form.location}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nDescription: ${form.description}`,
          type: 'quote_request',
        }),
      });
      const quoteJson = await quoteRes.json();
      if (!quoteJson.success) throw new Error(quoteJson.message || 'Failed to submit quote');

      // 2. If already logged in, just show success
      if (isAuthenticated) {
        setSubmitted(true);
        setCredentials({ alreadyLoggedIn: true });
        setLoading(false);
        return;
      }

      // 3. Auto-create account for the client
      const password = generatePassword(form.name);
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Client';

      let accountCreated = false;
      try {
        await register({
          first_name: firstName,
          last_name: lastName,
          email: form.email,
          password,
          phone: form.phone,
        });
        accountCreated = true;
        setCredentials({ email: form.email, password, isNew: true });
      } catch (regErr) {
        // Account already exists — prompt them to log in
        setCredentials({ email: form.email, alreadyExists: true });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    const ref = 'REQ-' + Date.now().toString(36).toUpperCase();

    return (
      <section className="py-20 bg-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Quote Request Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you, <strong>{form.name}</strong>. Our team will review your project and get back to you within 24–48 hours.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-left text-sm text-gray-600 space-y-1">
            <p><strong>Reference:</strong> {ref}</p>
            <p><strong>Service:</strong> {form.service}</p>
            <p><strong>Budget:</strong> {form.budget}</p>
          </div>

          {/* Already logged in */}
          {credentials?.alreadyLoggedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-left">
              <p className="font-semibold text-blue-800 mb-1">You're already signed in</p>
              <p className="text-sm text-blue-600 mb-3">Track your project progress from your customer portal.</p>
              <button onClick={() => navigate('/customer')}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 text-sm">
                <LogIn size={16} /> Go to My Portal
              </button>
            </div>
          )}

          {/* New account created */}
          {credentials?.isNew && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-left">
              <p className="font-semibold text-green-800 mb-1">✅ Account created for you!</p>
              <p className="text-sm text-green-700 mb-3">
                We've created a portal account so you can track your project progress. Save your credentials:
              </p>
              <div className="bg-white border border-green-200 rounded-lg p-3 font-mono text-sm text-gray-700 mb-3 space-y-1">
                <p><span className="text-gray-400">Email:</span> {credentials.email}</p>
                <p><span className="text-gray-400">Password:</span> {credentials.password}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={copyCredentials}
                  className="flex items-center gap-2 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy credentials'}
                </button>
                <button onClick={() => navigate('/customer')}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm">
                  <LogIn size={16} /> Go to My Portal
                </button>
              </div>
            </div>
          )}

          {/* Account already exists */}
          {credentials?.alreadyExists && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-left">
              <p className="font-semibold text-amber-800 mb-1">Account already exists</p>
              <p className="text-sm text-amber-700 mb-3">
                An account with <strong>{credentials.email}</strong> already exists. Sign in to monitor your project progress.
              </p>
              <Link
                to={`/login?redirect=${encodeURIComponent('/customer')}&reason=quote_submitted`}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-700 text-sm">
                <LogIn size={16} /> Sign In to Continue
              </Link>
            </div>
          )}

          <Link to="/" className="inline-block text-sm text-gray-500 hover:text-gray-700 mt-2">← Back to Home</Link>
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
          {/* Step indicator */}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

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
                        <option>Under $50,000</option>
                        <option>$50,000 - $100,000</option>
                        <option>$100,000 - $250,000</option>
                        <option>$250,000 - $500,000</option>
                        <option>$500,000 - $1M</option>
                        <option>Over $1M</option>
                        <option>Not sure</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Timeline</label>
                      <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        <option>ASAP</option><option>1-3 months</option><option>3-6 months</option><option>6-12 months</option><option>Over 1 year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear?</label>
                      <select name="howHeard" value={form.howHeard} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        <option>Google Search</option><option>Social Media</option><option>Referral</option><option>Other</option>
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
                {isAuthenticated && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg mb-4">
                    Signed in as <strong>{user?.email}</strong>. Your account will be linked to this request.
                  </div>
                )}
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <input
                          type="email" name="email" required value={form.email} onChange={handleChange}
                          className={`w-full px-4 py-2.5 pr-9 rounded-lg border text-sm focus:outline-none ${
                            emailValidation.status === 'valid' ? 'border-green-400 focus:border-green-500'
                            : emailValidation.status === 'invalid' ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="your@email.com" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {emailValidation.status === 'checking' && <Loader2 size={15} className="animate-spin text-gray-400" />}
                          {emailValidation.status === 'valid' && <CheckCircle2 size={15} className="text-green-500" />}
                          {emailValidation.status === 'invalid' && <XCircle size={15} className="text-red-500" />}
                        </span>
                      </div>
                      {emailValidation.status === 'invalid' && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <XCircle size={11} /> {emailValidation.message}
                        </p>
                      )}
                      {emailValidation.suggestion && (
                        <button type="button" onClick={() => setForm(f => ({ ...f, email: emailValidation.suggestion }))}
                          className="text-xs text-blue-600 mt-1 hover:underline">
                          Use {emailValidation.suggestion} instead?
                        </button>
                      )}
                      {emailValidation.status === 'valid' && emailValidation.message && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {emailValidation.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <div className="relative">
                        <input
                          type="tel" name="phone" required value={form.phone} onChange={handleChange}
                          className={`w-full px-4 py-2.5 pr-9 rounded-lg border text-sm focus:outline-none ${
                            phoneValidation.status === 'valid' ? 'border-green-400 focus:border-green-500'
                            : phoneValidation.status === 'invalid' ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                          }`}
                          placeholder="+250 7XX XXX XXX" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {phoneValidation.status === 'checking' && <Loader2 size={15} className="animate-spin text-gray-400" />}
                          {phoneValidation.status === 'valid' && <CheckCircle2 size={15} className="text-green-500" />}
                          {phoneValidation.status === 'invalid' && <XCircle size={15} className="text-red-500" />}
                        </span>
                      </div>
                      {phoneValidation.status === 'invalid' && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <XCircle size={11} /> {phoneValidation.message}
                        </p>
                      )}
                      {phoneValidation.status === 'valid' && phoneValidation.data?.type && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {phoneValidation.data.countryLabel} · {phoneValidation.data.type}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500" placeholder="Company name" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 text-gray-700 font-medium">Back</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (emailValidation.status === 'invalid') return;
                      if (phoneValidation.status === 'invalid') return;
                      setStep(3);
                    }}
                    disabled={emailValidation.status === 'checking' || phoneValidation.status === 'checking'}
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
                    Review & Submit
                  </button>
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
                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
                    A portal account will be created automatically so you can track your project progress.
                  </p>
                )}
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
