import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const servicesData = {
  'residential-construction': {
    title: 'Residential Construction',
    desc: 'We build exceptional residential properties that combine aesthetic beauty with functional design. From luxury villas to multi-unit apartment complexes.',
    why: 'Your home is your most important investment. We ensure every aspect meets your expectations through careful planning and quality materials.',
    process: ['Consultation & needs assessment', 'Site evaluation & feasibility', 'Custom design & planning', 'Permitting & approvals', 'Construction & management', 'Final inspection & handover'],
    features: ['Custom architectural design', 'Premium materials & finishes', 'Energy-efficient solutions', 'Smart home integration', 'Landscaping & outdoor spaces', 'Quality warranties'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    videoUrl: null,
  },
  'commercial-construction': {
    title: 'Commercial Construction',
    desc: 'Our commercial construction division delivers functional, efficient commercial spaces that support business success.',
    why: 'Commercial projects require precision and strict timelines. Our experienced team delivers spaces built to perform.',
    process: ['Business requirement analysis', 'Site selection support', 'Architectural & engineering design', 'Value engineering', 'Construction & fit-out', 'Commissioning & handover'],
    features: ['Modern office environments', 'Retail & hospitality spaces', 'Industrial facilities', 'Safety compliance', 'Sustainable practices', 'Flexible space planning'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  },
  'renovation': {
    title: 'Renovation & Remodeling',
    desc: 'Transform your existing space with comprehensive renovation services. From single rooms to complete transformations.',
    why: 'Renovation requires understanding existing structures. Our experience ensures smooth execution and stunning results.',
    process: ['Property inspection & assessment', 'Design & scope definition', 'Material selection & budgeting', 'Demolition & preparation', 'Construction & installation', 'Finishing & decoration'],
    features: ['Kitchen & bathroom remodeling', 'Basement & attic conversion', 'Structural modifications', 'Plumbing & electrical upgrades', 'Flooring & tiling', 'Painting & decoration'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    videoUrl: null,
  },
  'design-engineering': {
    title: 'Design & Engineering',
    desc: 'Comprehensive architectural and structural design services creating innovative, sustainable, and buildable designs.',
    why: 'Great buildings start with great design. Our team ensures thoughtful planning for success.',
    process: ['Concept development', 'Schematic design', 'Design development', 'Construction documents', 'Engineering reviews', 'Permit coordination'],
    features: ['Architectural design', 'Structural engineering', 'MEP engineering', '3D rendering', 'Sustainability analysis', 'Cost estimating'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
    videoUrl: null,
  },
  'infrastructure': {
    title: 'Infrastructure',
    desc: 'Critical infrastructure projects that connect communities and enable economic growth.',
    why: 'Infrastructure projects impact communities for generations. Our commitment ensures lasting value.',
    process: ['Feasibility study & survey', 'Environmental assessment', 'Detailed engineering design', 'Procurement & mobilization', 'Construction & quality control', 'Testing & commissioning'],
    features: ['Road & highway construction', 'Bridge & culvert construction', 'Water & sanitation systems', 'Drainage & flood control', 'Street lighting', 'Landscaping'],
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  'project-management': {
    title: 'Project Management',
    desc: 'Ensure your project is delivered on time, within budget, and to the highest quality standards.',
    why: 'Professional project management reduces risk and controls costs. Let us handle the complexities.',
    process: ['Project initiation & planning', 'Team assembly & procurement', 'Schedule & budget management', 'Quality & safety oversight', 'Progress monitoring', 'Closeout & handover'],
    features: ['Full-time site supervision', 'Cost control & reporting', 'Schedule management', 'Quality assurance', 'Safety management', 'Contract administration'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    videoUrl: null,
  },
  'landscaping': {
    title: 'Landscaping',
    desc: 'Beautiful outdoor spaces that complement your property and enhance curb appeal.',
    why: 'Great landscapes increase property value and create inviting spaces. Our team designs and builds outdoor environments that last.',
    process: ['Site assessment & design', 'Garden & planting layout', 'Hardscaping & patios', 'Irrigation installation', 'Outdoor lighting', 'Final finishing & handover'],
    features: ['Garden design', 'Patios & decks', 'Irrigation systems', 'Outdoor lighting', 'Hardscaping', 'Seasonal planting'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    videoUrl: null,
  },
  'interior-design': {
    title: 'Interior Design',
    desc: 'Transform your space with our professional interior design services.',
    why: 'Interior design shapes how a space feels and functions. Our specialists balance aesthetics, comfort, and practicality.',
    process: ['Needs assessment', 'Concept & mood board', 'Space planning', 'Material & furniture selection', 'Lighting design', 'Installation & styling'],
    features: ['Space planning', 'Color consultation', 'Furniture selection', 'Lighting design', 'Material selection', 'Custom styling'],
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80',
    videoUrl: null,
  },
};

const splitList = (str) => (str || '').split(',').map(x => x.trim()).filter(Boolean);

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const stripRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setShowVideo(false);
    setGallery([]);
    setActiveImage(null);
    setService(null);
    fetch(API_BASE_URL + `/api/services/${slug}`)
      .then(r => r.json())
      .then(json => {
        if (!mounted) return;
        if (json.success && json.data) {
          const s = json.data;
          setService({
            title: s.name,
            desc: s.description || '',
            why: null,
            process: splitList(s.process),
            features: splitList(s.benefits),
            image: s.image || null,
            videoUrl: s.videoUrl || null,
          });
          fetch(API_BASE_URL + `/api/services/${slug}/images`)
            .then(r => r.json())
            .then(imgJson => {
              if (!mounted) return;
              const imgs = (imgJson.success ? imgJson.data : []) || [];
              setGallery(imgs);
              setActiveImage(s.image || imgs[0]?.image || null);
            })
            .catch(() => { if (mounted) setActiveImage(s.image || null); });
        } else {
          setService(servicesData[slug] || null);
          setActiveImage(servicesData[slug]?.image || null);
        }
      })
      .catch(() => {
        if (mounted) {
          setService(servicesData[slug] || null);
          setActiveImage(servicesData[slug]?.image || null);
        }
      });
    return () => { mounted = false; };
  }, [slug]);

  const images = useMemo(() => {
    const list = [];
    if (service?.image) list.push(service.image);
    gallery.forEach(g => { if (g.image && !list.includes(g.image)) list.push(g.image); });
    return list;
  }, [service, gallery]);

  useEffect(() => {
    if (!images.length || showVideo || lightbox !== null) return;
    const timer = setInterval(() => {
      setActiveImage(prev => {
        if (prev == null) return images[0];
        const idx = images.indexOf(prev);
        return images[(idx + 1) % images.length];
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [images, showVideo, lightbox]);

  useEffect(() => {
    const el = stripRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeImage]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(l => (l + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightbox(l => (l + images.length - 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (service === null) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading service...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-gray-500 mb-6">The service you are looking for does not exist.</p>
        <Link to="/services" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold">View All Services</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="text-blue-400 text-sm font-medium hover:underline mb-4 inline-block">&larr; Back to Services</Link>
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider block mb-2">Our Service</span>
          <h1 className="text-4xl sm:text-5xl font-bold">{service.title}</h1>
        </div>
      </section>

      {(service.image || gallery.length > 0) && (
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              {showVideo && service.videoUrl ? (
                <iframe
                  src={service.videoUrl}
                  title={service.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeImage ? (
                <button type="button" onClick={() => setLightbox(images.indexOf(activeImage))} className="block w-full h-full cursor-zoom-in" aria-label="View photo">
                  <img key={activeImage} src={activeImage} alt={service.title} className="w-full h-full object-cover animate-fade-in" />
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
              {!showVideo && images.length > 0 && (
                <>
                  <button
                    onClick={() => setLightbox(images.indexOf(activeImage))}
                    className="absolute bottom-3 left-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <Maximize2 size={13} /> View
                  </button>
                  <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {(images.indexOf(activeImage) + 1) || 1} / {images.length}
                  </span>
                </>
              )}
              {service.videoUrl && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105"
                >
                  {showVideo ? '📷 Photo' : '▶ Video'}
                </button>
              )}
            </div>
            {gallery.length > 0 && (
              <div ref={stripRef} className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={`${img.image}-${i}`}
                    data-active={activeImage === img.image}
                    onClick={() => { setActiveImage(img.image); setShowVideo(false); }}
                    className={`relative w-28 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activeImage === img.image ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img.image} alt={img.caption || `photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              {service.why && (
                <>
                  <h3 className="font-bold text-gray-900 mb-3">Why Choose Us?</h3>
                  <p className="text-gray-600">{service.why}</p>
                </>
              )}
            </div>
            {service.features?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <div className="space-y-3">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {service.process?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Process</h2>
              <p className="text-gray-500">How we deliver {service.title.toLowerCase()} projects</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.process.map((step, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="font-medium text-gray-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Contact us today to discuss your {service.title.toLowerCase()} project.</p>
          <Link to="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
            Get a Free Quote
          </Link>
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"><X size={28} /></button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + images.length - 1) % images.length); }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={32} />
          </button>
          <figure className="max-w-5xl w-full px-14 sm:px-20" onClick={e => e.stopPropagation()}>
            <img key={lightbox} src={images[lightbox]} alt={gallery.find(x => x.image === images[lightbox])?.caption || service.title} className="w-full max-h-[80vh] object-contain mx-auto rounded-lg animate-fade-in" />
            {(() => { const g = gallery.find(x => x.image === images[lightbox]); return g?.caption ? <figcaption className="text-center text-white/80 text-sm mt-4">{g.caption}</figcaption> : null; })()}
            <p className="text-center text-white/40 text-xs mt-2">{lightbox + 1} / {images.length}</p>
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
