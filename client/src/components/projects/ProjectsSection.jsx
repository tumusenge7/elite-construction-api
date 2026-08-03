import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import ScrollButtons from './ScrollButtons';

export default function ProjectsSection({
  projects = [],
  title = 'Featured Projects',
  subtitle = '',
  eyebrow = 'Portfolio',
  viewAllLink = '/projects',
  emptyMessage = 'No projects to showcase yet.',
  ariaLabel = 'Projects showcase',
  className = '',
  autoScroll = true,
  interval = 5000,
}) {
  const scrollerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);

  const pauseAuto = useCallback((ms = 8000) => {
    setAutoPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setAutoPaused(false), ms);
  }, []);

  useEffect(() => () => { if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 40 || e.deltaY === 0) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      el.scrollLeft += delta;
      pauseAuto(6000);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [pauseAuto]);

  const scrollByCard = useCallback((direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector('[data-project-card]');
    const step = (first ? first.offsetWidth + 24 : el.clientWidth * 0.9) * direction;
    el.scrollBy({ left: step, behavior: 'smooth' });
    pauseAuto(6000);
  }, [pauseAuto]);

  useEffect(() => {
    if (!autoScroll || autoPaused || hovering || projects.length <= 1) return;
    const timer = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard(1);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [autoScroll, interval, autoPaused, hovering, projects.length, scrollByCard]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
  };

  return (
    <section aria-label={ariaLabel} className={className || 'py-16 bg-white'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            {eyebrow && <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{eyebrow}</span>}
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-2 max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            {viewAllLink && (
              <Link to={viewAllLink} className="text-blue-600 font-semibold hover:underline text-sm hidden sm:inline">
                View All →
              </Link>
            )}
            <ScrollButtons onPrev={() => scrollByCard(-1)} onNext={() => scrollByCard(1)} label={title.toLowerCase()} />
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-gray-400 py-12">{emptyMessage}</p>
        ) : (
          <div
            ref={scrollerRef}
            tabIndex={0}
            role="list"
            aria-label={`Scrollable ${title}`}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={() => pauseAuto()}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 sm:mx-0 px-4 sm:px-0 outline-none"
          >
            {projects.map((p, i) => (
              <div key={p.id} data-project-card className="shrink-0">
                <ProjectCard project={p} index={i} />
              </div>
            ))}
            <div className="w-2 shrink-0" aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  );
}
