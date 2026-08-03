import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';

const fallbackServices = [
  {
    slug: 'residential-construction',
    name: 'Residential Construction',
    description: 'Custom homes, villas, townhouses, and apartment buildings crafted with premium materials and modern design.',
    benefits: ['Custom home building', 'Multi-unit residential', 'Luxury villas', 'Interior finishing'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    videoUrl: null,
  },
  {
    slug: 'commercial-construction',
    name: 'Commercial Construction',
    description: 'Office buildings, retail centers, hotels, and industrial facilities for modern business needs.',
    benefits: ['Office complexes', 'Retail centers', 'Hotels & hospitality', 'Industrial facilities'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  },
  {
    slug: 'renovation',
    name: 'Renovation & Remodeling',
    description: 'Transform existing spaces with comprehensive renovation services that breathe new life into old structures.',
    benefits: ['Kitchen remodeling', 'Bathroom renovation', 'Full home renovation', 'Commercial remodeling'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    videoUrl: null,
  },
  {
    slug: 'design-engineering',
    name: 'Design & Engineering',
    description: 'Architectural design, structural engineering, and project planning by licensed professionals.',
    benefits: ['Architectural design', 'Structural engineering', 'Project planning', '3D visualization'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    videoUrl: null,
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    description: 'Roads, bridges, water supply systems, drainage, and public utilities built to last.',
    benefits: ['Road construction', 'Bridge building', 'Water systems', 'Public utilities'],
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    slug: 'project-management',
    name: 'Project Management',
    description: 'End-to-end construction project management ensuring timelines, budgets, and quality standards are met.',
    benefits: ['Budget management', 'Timeline planning', 'Quality control', 'Risk management'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    videoUrl: null,
  },
];

const colors = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-emerald-500 to-emerald-700',
  'from-purple-500 to-purple-700',
  'from-orange-500 to-orange-700',
  'from-teal-500 to-teal-700',
];

export default function Services() {
  const [services, setServices] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(API_BASE_URL + '/api/services/with-images?status=active')
      .then(r => r.json())
      .then(json => {
        if (!mounted) return;
        const items = (json.data || []).map(s => ({
          ...s,
          benefits: (s.benefits || '').split(',').map(b => b.trim()).filter(Boolean),
        }));
        setServices(items.length ? items : fallbackServices);
      })
      .catch(() => {
        if (mounted) setServices(fallbackServices);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">What We Offer</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Comprehensive construction services from concept to completion — delivered by Rwanda's most trusted construction team.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services === null ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No services available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <div
                  key={s.slug || s._id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Image / Video Toggle */}
                  <div className="relative h-52 overflow-hidden">
                    {activeVideo === s.slug && s.videoUrl ? (
                      <iframe
                        src={s.videoUrl}
                        title={s.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white text-4xl font-bold`}>
                            {s.name.charAt(0)}
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-t ${colors[i % colors.length]} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                      </>
                    )}
                    {s.images?.length > 0 && (
                      <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {s.images.length} photo{s.images.length === 1 ? '' : 's'}
                      </span>
                    )}
                    {s.videoUrl && (
                      <button
                        onClick={() => setActiveVideo(activeVideo === s.slug ? null : s.slug)}
                        className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105"
                      >
                        {activeVideo === s.slug ? ' Photo' : 'Video'}
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{s.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                    {s.benefits?.length > 0 && (
                      <ul className="space-y-1 mb-5">
                        {s.benefits.slice(0, 4).map((f) => (
                          <li key={f} className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to={`/services/${s.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:gap-2 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-blue-100 mb-8">Every project is unique. Contact us to discuss your specific requirements.</p>
          <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 inline-block">
            Talk to Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
