import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, ShieldCheck } from 'lucide-react';
import heroBg from '../../assets/hero.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || null;
  const reason = searchParams.get('reason') || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (user.role === 'Super Admin' || user.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to reach the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — background image */}
      <div
        className="hidden lg:flex flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight">Building Excellence.<br />Delivering Trust.</h2>
          <p className="mt-3 text-blue-200 text-lg">Elite Construction — your project, our commitment.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center py-12 px-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Contextual message when redirected */}
        {(redirect || reason === 'auth_required') && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-lg mb-5">
            <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Login required</p>
              <p className="text-blue-600 mt-0.5">
                {reason === 'quote_submitted'
                  ? 'Your quote request was submitted! Sign in to monitor your project progress.'
                  : 'Please sign in to continue monitoring your project progress.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/request-quote" className="text-blue-600 font-medium hover:underline">
            Submit a quote request
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-3">
          Demo: admin@eliteconstruction.com / password123
        </p>
      </div>
      </div>
    </div>
  );
}
