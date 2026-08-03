import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiCheck } from 'react-icons/fi';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: 'easeOut', delay },
});

export default function AboutShowcase({
  eyebrow = 'Who We Are',
  title = "Crafting Landmarks That Define Rwanda's Skyline",
  description = 'Elite Construction is a full-service construction company delivering high-quality residential, commercial, and infrastructure projects across Rwanda — combining modern engineering with local expertise to build structures that last.',
  description2 = 'From the first blueprint to the final handover, our licensed engineers, architects, and project managers deliver every project on time, within budget, and to the highest standards.',
  tags = ['ISO Certified', 'Licensed Engineers', 'Turnkey Delivery', 'Rwanda-Based'],
  stats = [
    { value: '150', label: 'Projects Delivered' },
    { value: '10', label: 'Years of Experience' },
    { value: '98', label: 'Client Satisfaction' },
  ],
  mainImage = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
  floatImageA = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  floatImageB = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  linkTo = '/about',
  ctaLabel = 'Learn More About Us',
}) {
  return (
    <section className="relative overflow-hidden bg-[#0a1018] py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -top-48 -right-48 h-[560px] w-[560px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 h-[560px] w-[560px] rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <motion.span {...fadeUp()} className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
              <span className="h-px w-10 bg-blue-400" />
              {eyebrow}
            </motion.span>
            <motion.h2 {...fadeUp(0.1)} className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[54px]">
              {title}
            </motion.h2>
            <motion.p {...fadeUp(0.2)} className="mt-6 text-lg leading-relaxed text-slate-300">
              {description}
            </motion.p>
            <motion.p {...fadeUp(0.3)} className="mt-4 leading-relaxed text-slate-400">
              {description2}
            </motion.p>

            <motion.ul {...fadeUp(0.4)} className="mt-8 flex flex-wrap gap-2.5">
              {tags.map(tag => (
                <li key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                  <FiCheck className="text-blue-400" size={15} />
                  {tag}
                </li>
              ))}
            </motion.ul>

            <motion.div {...fadeUp(0.5)} className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.6)} className="mt-10">
              <Link
                to={linkTo}
                className="group inline-flex items-center gap-3 rounded-full bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-blue-400"
              >
                {ctaLabel}
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-[540px] py-10 sm:py-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-2xl shadow-black/50 ring-1 ring-white/10">
              <img src={mainImage} alt="Elite Construction flagship project" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="absolute -top-2 right-0 w-[46%] overflow-hidden rounded-2xl border-[5px] border-[#0a1018] shadow-xl shadow-black/50 sm:-top-6 sm:right-2"
            >
              <img src={floatImageA} alt="Residential construction" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute bottom-0 left-0 w-[52%] overflow-hidden rounded-2xl border-[5px] border-[#0a1018] shadow-xl shadow-black/50 sm:-bottom-6 sm:left-2"
            >
              <img src={floatImageB} alt="Construction site" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 right-0 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-4 shadow-xl shadow-blue-500/30 sm:-bottom-6 sm:right-6"
            >
              <FiAward className="text-white" size={36} />
              <div>
                <div className="text-lg font-extrabold leading-none text-white">ISO 9001</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-blue-100">Certified Quality</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
