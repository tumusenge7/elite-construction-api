import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden rounded-2xl bg-gray-900 shadow-lg hover:shadow-2xl transition-shadow duration-500"
    >
      <Link to={project.link} className="absolute inset-0 block" aria-label={project.title}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

        {project.badge && (
          <span className={`absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full shadow ${project.badgeClass || 'bg-white/90 text-gray-700'}`}>
            {project.badge}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-[13px] font-medium uppercase tracking-[0.25em] text-blue-300 mb-2">{project.category}</p>
          <h3 className="text-[22px] sm:text-2xl lg:text-[28px] font-extrabold uppercase leading-tight text-white tracking-wide transition-transform duration-500 group-hover:-translate-y-1.5">
            {project.title}
          </h3>
          {project.description && (
            <p className="mt-3 text-sm text-white/80 max-w-md transition-opacity duration-500 group-hover:opacity-100">
              {project.description}
            </p>
          )}
        </div>

        <span className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/70 text-white group-hover:bg-white group-hover:text-gray-900 group-hover:border-white group-hover:scale-110 transition-all duration-500">
          <FiArrowRight size={22} />
        </span>
      </Link>
    </motion.article>
  );
}
