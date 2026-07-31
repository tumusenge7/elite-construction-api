import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-lg font-bold text-white">Elite Construction</span>
            </div>
            <p className="text-sm leading-relaxed">
              Building excellence and trust through quality construction services.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-sm hover:text-white">Services</Link></li>
              <li><Link to="/projects" className="text-sm hover:text-white">Projects</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white">Contact</Link></li>
              <li><Link to="/request-quote" className="text-sm hover:text-white">Request a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>KG 123 Ave, Kacyiru, Kigali</li>
              <li>+250 788 000 000</li>
              <li>info@eliteconstruction.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Elite Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
