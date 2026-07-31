import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        </div>
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800">
            Go Home
          </Link>
          <Link to="/contact" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
