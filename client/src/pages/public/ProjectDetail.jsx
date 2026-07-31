import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { crud } from '../../services/api';

const projectsApi = crud('projects');

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

const statusLabel = (s) => {
  if (s === 'completed') return 'Completed';
  if (['planning', 'design', 'site_preparation', 'foundation', 'structure', 'roofing', 'mep', 'finishing', 'inspection'].includes(s)) return 'In Progress';
  if (s === 'on_hold') return 'On Hold';
  if (s === 'cancelled') return 'Cancelled';
  return s?.replace(/_/g, ' ') || '';
};

const statusColor = (s) => {
  if (s === 'completed') return 'bg-green-100 text-green-700';
  if (s === 'on_hold' || s === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    projectsApi.get(slug)
      .then(res => setProject(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !project) return (
    <div className="py-32 text-center">
      <div className="text-6xl mb-4">🏗️</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
      <p className="text-gray-500 mb-6">This project doesn't exist or has been removed.</p>
      <Link to="/projects" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800">
        ← View All Projects
      </Link>
    </div>
  );

  const hasDetails = project.description || project.challenges || project.solutions || project.results;
  const hasStats = project.budget || project.progress !== undefined || project.startDate || project.expectedCompletion;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src={project.coverImage || FALLBACK_IMG}
            alt={project.name}
            className="w-full h-full object-cover opacity-30"
            onError={e => { e.target.src = FALLBACK_IMG; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Link to="/projects" className="inline-flex items-center gap-1 text-blue-400 text-sm font-medium hover:underline mb-6">
            ← Back to Projects
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.category && (
              <span className="bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {project.category}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(project.status)}`}>
              {statusLabel(project.status)}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl">{project.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {project.location && <span>📍 {project.location}</span>}
            {project.clientName && <span>👤 {project.clientName}</span>}
            {project.year && <span>📅 {project.year}</span>}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {hasStats && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {project.budget && (
                <div className="py-6 px-6 text-center">
                  <p className="text-2xl font-bold text-gray-900">${(project.budget / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Budget</p>
                </div>
              )}
              {project.progress !== undefined && (
                <div className="py-6 px-6 text-center">
                  <p className="text-2xl font-bold text-blue-600">{project.progress}%</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Complete</p>
                </div>
              )}
              {project.startDate && (
                <div className="py-6 px-6 text-center">
                  <p className="text-2xl font-bold text-gray-900">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Start Date</p>
                </div>
              )}
              {project.expectedCompletion && (
                <div className="py-6 px-6 text-center">
                  <p className="text-2xl font-bold text-gray-900">{new Date(project.expectedCompletion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Expected Completion</p>
                </div>
              )}
            </div>
            {project.progress !== undefined && (
              <div className="px-6 pb-4">
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      {hasDetails && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Left: Image + quick info */}
              <div className="lg:col-span-1">
                <img
                  src={project.coverImage || FALLBACK_IMG}
                  alt={project.name}
                  className="w-full rounded-xl object-cover aspect-[4/3] shadow-md"
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3">
                  {[
                    { label: 'Category', value: project.category },
                    { label: 'Client', value: project.clientName },
                    { label: 'Location', value: project.location },
                    { label: 'Year', value: project.year },
                    { label: 'Status', value: statusLabel(project.status) },
                    { label: 'Budget', value: project.budget ? `$${project.budget.toLocaleString()}` : null },
                  ].filter(i => i.value).map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-2 space-y-8">
                {project.description && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Overview</h2>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                )}

                {project.challenges && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-sm">!</div>
                      <h3 className="text-lg font-bold text-gray-900">The Challenge</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{project.challenges}</p>
                  </div>
                )}

                {project.solutions && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">→</div>
                      <h3 className="text-lg font-bold text-gray-900">Our Solution</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{project.solutions}</p>
                  </div>
                )}

                {project.results && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">✓</div>
                      <h3 className="text-lg font-bold text-gray-900">The Result</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{project.results}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in a Similar Project?</h2>
          <p className="text-gray-300 mb-8">Contact our team to discuss how we can bring your vision to life.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get a Quote
            </Link>
            <Link to="/projects" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
