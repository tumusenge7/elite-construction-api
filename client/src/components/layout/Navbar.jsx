import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Elite Construction</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              Login
            </Link>
            <Link
              to="/request-quote"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
            >
              Get a Quote
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-2 border-gray-200" />
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded"
            >
              Login
            </Link>
            <Link
              to="/request-quote"
              onClick={() => setOpen(false)}
              className="block mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold text-center hover:bg-blue-700"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
