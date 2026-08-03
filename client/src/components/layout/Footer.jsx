import { useState } from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'How We Work', path: '/how-we-work' },
      { name: 'Our Team', path: '/team' },
      { name: 'Safety', path: '/safety' },
      { name: 'Sustainability', path: '/sustainability' },
      { name: 'Diversity & Inclusion', path: '/diversity' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Residential Construction', path: '/services/residential-construction' },
      { name: 'Commercial Construction', path: '/services/commercial-construction' },
      { name: 'Infrastructure', path: '/services/infrastructure' },
      { name: 'Renovation & Remodeling', path: '/services/renovation' },
      { name: 'Design & Engineering', path: '/services/design-engineering' },
      { name: 'Project Management', path: '/services/project-management' },
      { name: 'Landscaping', path: '/services/landscaping' },
      { name: 'Interior Design', path: '/services/interior-design' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Projects', path: '/projects' },
      { name: 'Insights & News', path: '/insights' },
      { name: 'Cost Estimator', path: '/estimator' },
      { name: 'Request a Quote', path: '/request-quote' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Client Portal', path: '/login' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-[#0f2137] text-gray-400">
      {/* Newsletter Bar */}
      <div className="border-b border-white/10 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold">Stay Updated</p>
              <p className="text-blue-200 text-sm">Get the latest news, projects and insights from Elite Construction.</p>
            </div>
            {subscribed ? (
              <p className="text-white font-medium text-sm bg-blue-600 px-6 py-2.5 rounded-lg">✓ Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 sm:w-64 px-4 py-2.5 rounded-lg text-sm text-gray-900 focus:outline-none" />
                <button type="submit" className="bg-white text-blue-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-lg font-bold text-white">Elite Construction</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Rwanda's premier construction company. Building excellence, delivering trust since 2016.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'YouTube', href: 'https://www.youtube.com/@blaisejavi', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
                { label: 'LinkedIn', href: '#', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
                { label: 'Facebook', href: '#', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Awards Row */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-4">
              {['ISO 9001 Certified', 'Rwanda Standards Board', 'Green Building Council', 'Safety Excellence Award 2024'].map(award => (
                <span key={award} className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full border border-white/10">
                  🏆 {award}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Elite Construction Ltd. All rights reserved.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600">
            <Link to="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-400">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-gray-400">Sitemap</Link>
            <span>KG 123 Ave, Kacyiru, Kigali, Rwanda</span>
            <span>+250 788 000 000</span>
            <span>info@eliteconstruction.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
