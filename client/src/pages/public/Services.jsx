import { useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Residential Construction',
    slug: 'residential-construction',
    desc: 'Custom homes, villas, townhouses, and apartment buildings crafted with premium materials and modern design.',
    features: ['Custom home building', 'Multi-unit residential', 'Luxury villas', 'Interior finishing'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    video: null,
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Commercial Construction',
    slug: 'commercial-construction',
    desc: 'Office buildings, retail centers, hotels, and industrial facilities for modern business needs.',
    features: ['Office complexes', 'Retail centers', 'Hotels & hospitality', 'Industrial facilities'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    title: 'Renovation & Remodeling',
    slug: 'renovation',
    desc: 'Transform existing spaces with comprehensive renovation services that breathe new life into old structures.',
    features: ['Kitchen remodeling', 'Bathroom renovation', 'Full home renovation', 'Commercial remodeling'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    video: null,
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    title: 'Design & Engineering',
    slug: 'design-engineering',
    desc: 'Architectural design, structural engineering, and project planning by licensed professionals.',
    features: ['Architectural design', 'Structural engineering', 'Project planning', '3D visualization'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    video: null,
    color: 'from-purple-500 to-purple-700',
  },
  {
    title: 'Infrastructure',
    slug: 'infrastructure',
    desc: 'Roads, bridges, water supply systems, drainage, and public utilities built to last.',
    features: ['Road construction', 'Bridge building', 'Water systems', 'Public utilities'],
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    color: 'from-orange-500 to-orange-700',
  },
  {
    title: 'Project Management',
    slug: 'project-management',
    desc: 'End-to-end construction project management ensuring timelines, budgets, and quality standards are met.',
    features: ['Budget management', 'Timeline planning', 'Quality control', 'Risk management'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    video: null,
    color: 'from-teal-500 to-teal-700',
  },
];

export default function Services() {
  const [activeVideo, setActiveVideo] = useState(null);

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div
                key={s.slug}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Image / Video Toggle */}
                <div className="relative h-52 overflow-hidden">
                  {activeVideo === s.slug && s.video ? (
                    <iframe
                      src={s.video}
                      title={s.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                    </>
                  )}
                  {s.video && (
                    <button
                      onClick={() => setActiveVideo(activeVideo === s.slug ? null : s.slug)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105"
                    >
                      {activeVideo === s.slug ? '📷 Photo' : '▶ Video'}
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{s.desc}</p>
                  <ul className="space-y-1 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:gap-2 transition-all"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
