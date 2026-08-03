import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Building2, Wrench, DraftingCompass, Road, BarChart3 } from 'lucide-react';
import { crud } from '../../services/api';
import ProjectsSection from '../../components/projects/ProjectsSection';
import AboutShowcase from '../../components/about/AboutShowcase';
import { toProjectCards, FALLBACK_IMG } from '../../components/projects/projectsData';

const projectsApi = crud('projects');

// Put your video URL here — upload your video to /uploads or use an external URL
const HERO_VIDEO = import.meta.env.VITE_HERO_VIDEO_URL || '';

const services = [
  { icon: HomeIcon, title: 'Residential', desc: 'Custom homes, villas & apartments built with premium materials.' },
  { icon: Building2, title: 'Commercial', desc: 'Office buildings, retail centers & industrial facilities.' },
  { icon: Wrench, title: 'Renovation', desc: 'Transform your space with expert remodeling services.' },
  { icon: DraftingCompass, title: 'Design & Engineering', desc: 'Architectural design, structural engineering & planning.' },
  { icon: Road, title: 'Infrastructure', desc: 'Roads, bridges, utilities & public works projects.' },
  { icon: BarChart3, title: 'Project Management', desc: 'End-to-end management ensuring timelines & budgets.' },
];

function ChannelVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    fetch(API_BASE_URL + '/api/youtube/videos?limit=6')
      .then(r => r.json())
      .then(json => { if (json.success) setVideos(json.data || []); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />)}
    </div>
  );

  if (videos.length === 0) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">▶</div>
      <p className="text-gray-400">No videos available yet.</p>
      <a href="https://www.youtube.com/@blaisejavi" target="_blank" rel="noopener noreferrer"
        className="text-red-400 hover:underline text-sm mt-2 inline-block">Visit our channel →</a>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <div key={video.id} className="group rounded-xl overflow-hidden bg-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          {playing === video.id ? (
            <div className="aspect-video">
              <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`} title={video.title}
                className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <div className="aspect-video relative cursor-pointer" onClick={() => setPlaying(video.id)}>
              <img src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {new Date(video.publishedAt).toLocaleDateString()}
              </div>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-red-400 transition-colors">{video.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    projectsApi.list({ limit: 100 }).then(res => {
      const all = res.data.data || [];
      const highlights = all.filter(p => p.isHighlight);
      setFeaturedProjects(highlights.length > 0 ? highlights.slice(0, 3) : all.slice(0, 3));
    }).catch(() => { });
  }, []);

  return (
    <>
      {/* Hero — Video Background */}
      <section className="relative text-white min-h-[90vh] flex items-center justify-center overflow-hidden">
        {HERO_VIDEO ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FALLBACK_IMG})` }} />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">Elite Construction Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
            Building <span className="text-blue-400">Excellence</span><br />Delivering Trust
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">

          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/request-quote" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105">
              Get a Free Quote
            </Link>
            <Link to="/projects" className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are — layered dark showcase */}
      <AboutShowcase />

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Services</h2>
            <p className="text-gray-600 mt-2">Comprehensive construction solutions for every need</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-3"><s.icon className="w-8 h-8 text-blue-600" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects — horizontal showcase */}
      <ProjectsSection
        title="Featured Projects"
        subtitle="A curated selection of our latest work — scroll to explore."
        eyebrow="Portfolio"
        viewAllLink="/projects"
        emptyMessage="No featured projects yet. Add projects in the admin and mark them as highlights."
        projects={toProjectCards(featuredProjects)}
      />

      {/* YouTube Channel */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">Our Channel</span>
              <h2 className="text-3xl font-bold text-white mt-1">Latest Videos</h2>
              <p className="text-gray-400 text-sm mt-1">Watch our latest construction projects and updates</p>
            </div>
            <a href="https://www.youtube.com/@blaisejavi" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              Subscribe
            </a>
          </div>
          <ChannelVideos />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: '"Elite Construction delivered our office complex ahead of schedule and under budget."', name: 'Jean Pierre Mugabo', role: 'CEO, Mugabo Enterprises' },
              { quote: '"Our dream home became a reality thanks to Elite. The quality of work is outstanding."', name: 'Alice Mukamana', role: 'Homeowner' },
              { quote: '"The infrastructure project was complex but Elite handled it with expertise."', name: 'Patrick Habimana', role: 'Project Director, RURA' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
                <p className="text-sm text-gray-600 italic mb-4">{t.quote}</p>
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Get in touch with us for a free consultation and quote. Our team is ready to bring your vision to life.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105">
              Contact Us Today
            </Link>
            <Link to="/estimator" className="border border-white/40 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
              Try Cost Estimator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
