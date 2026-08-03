import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const megaMenu = [
  {
    name: 'Company',
    items: [
      { name: 'About Us', path: '/about', desc: 'Our story, mission & values' },
      { name: 'How We Work', path: '/how-we-work', desc: 'Our process from start to finish' },
      { name: 'Our Team', path: '/team', desc: 'Meet our leadership' },
      { name: 'Sustainability', path: '/sustainability', desc: 'Green building commitment' },
      { name: 'Safety', path: '/safety', desc: 'Our safety-first culture' },
      { name: 'Diversity & Inclusion', path: '/diversity', desc: 'Building an inclusive workplace' },
    ],
  },
  {
    name: 'Services',
    items: [
      { name: 'All Services', path: '/services', desc: 'Full service catalog' },
      { name: 'Residential Construction', path: '/services/residential-construction', desc: 'Homes, villas & apartments' },
      { name: 'Commercial Construction', path: '/services/commercial-construction', desc: 'Offices & retail centers' },
      { name: 'Infrastructure', path: '/services/infrastructure', desc: 'Roads, bridges & utilities' },
      { name: 'Renovation & Remodeling', path: '/services/renovation', desc: 'Remodeling & restoration' },
      { name: 'Design & Engineering', path: '/services/design-engineering', desc: 'Architecture & structural' },
      { name: 'Project Management', path: '/services/project-management', desc: 'End-to-end oversight' },
      { name: 'Landscaping', path: '/services/landscaping', desc: 'Outdoor spaces & gardens' },
      { name: 'Interior Design', path: '/services/interior-design', desc: 'Space planning & styling' },
    ],
  },
  {
    name: 'Insights',
    items: [
      { name: 'News & Articles', path: '/insights', desc: 'Latest updates & stories' },
      { name: 'Projects', path: '/projects', desc: 'Our portfolio' },
      { name: 'Cost Estimator', path: '/estimator', desc: 'Get an instant estimate' },
      { name: 'Request a Quote', path: '/request-quote', desc: 'Start your project' },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMouseEnter = (name) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">Elite Construction</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {megaMenu.map((menu) => (
              <div key={menu.name} className="relative"
                onMouseEnter={() => handleMouseEnter(menu.name)}
                onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${activeMenu === menu.name ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>
                  {menu.name}
                  <ChevronDown size={14} className={`transition-transform ${activeMenu === menu.name ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === menu.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
                    onMouseEnter={() => handleMouseEnter(menu.name)}
                    onMouseLeave={handleMouseLeave}>
                    {menu.items.map((item) => (
                      <Link key={item.path} to={item.path}
                        className="flex flex-col px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors">
              Client Login
            </Link>
            <Link to="/request-quote" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Get a Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {megaMenu.map((menu) => (
              <div key={menu.name}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === menu.name ? null : menu.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  {menu.name}
                  <ChevronDown size={14} className={`transition-transform ${mobileExpanded === menu.name ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === menu.name && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-blue-100 pl-3">
                    {menu.items.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <hr className="my-2 border-gray-200" />
            <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Client Login</Link>
            <Link to="/request-quote" onClick={() => setOpen(false)} className="block mt-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-blue-700">Get a Quote</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
