import { HardHat, GraduationCap, ScanSearch, ClipboardList, HeartPulse, Users } from 'lucide-react';

const stats = [
  { value: '0', label: 'Lost Time Incidents in 2024' },
  { value: '2M+', label: 'Safe Work Hours' },
  { value: '100%', label: 'Sites with Safety Officers' },
  { value: '48hrs', label: 'Incident Response Time' },
];

const programs = [
  { icon: HardHat, title: 'Daily Safety Briefings', desc: 'Every site starts with a toolbox talk covering the day\'s risks, procedures, and emergency protocols.' },
  { icon: GraduationCap, title: 'Safety Training', desc: 'All workers complete mandatory safety induction and role-specific training before stepping on site.' },
  { icon: ScanSearch, title: 'Site Inspections', desc: 'Weekly safety audits by our HSE team identify and eliminate hazards before they cause harm.' },
  { icon: ClipboardList, title: 'Incident Reporting', desc: 'A zero-blame reporting culture encourages near-miss reporting to prevent future incidents.' },
  { icon: HeartPulse, title: 'Emergency Response', desc: 'Every site has a trained first-aider, emergency plan, and direct line to medical services.' },
  { icon: Users, title: 'Subcontractor Standards', desc: 'All subcontractors must meet our safety standards and are regularly audited for compliance.' },
];

export default function Safety() {
  return (
    <>
      <section className="bg-gradient-to-br from-red-900 to-red-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-red-300 font-semibold text-sm uppercase tracking-wider">Safety First</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-5">Everyone Goes Home Safe</h1>
            <p className="text-red-100 text-lg leading-relaxed">
              At Elite Construction, safety is not a priority — it's a value. We believe that every worker deserves to return home safely every day, and we build our entire operation around that belief.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#0f2137]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-red-400">{s.value}</p>
                <p className="text-gray-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Safety Programs</h2>
            <p className="text-gray-500 mt-2">A comprehensive approach to keeping everyone safe</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <div key={i} className="bg-red-50 border border-red-100 p-6 rounded-xl hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex justify-center mb-4"><p.icon className="w-9 h-9 text-red-600" /></div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
              alt="Safety on site" className="rounded-2xl shadow-xl w-full object-cover h-80" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Safety Policy</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Elite Construction is committed to providing a safe and healthy working environment for all employees, subcontractors, visitors, and the public. We comply with all applicable health and safety legislation in Rwanda.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our Health, Safety & Environment (HSE) team works proactively to identify risks, implement controls, and continuously improve our safety performance across all project sites.
              </p>
              <div className="flex flex-wrap gap-3">
                {['ISO 45001 Certified', 'OSHA Compliant', 'Zero Harm Policy', 'HSE Audited Monthly'].map(tag => (
                  <span key={tag} className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Report a Safety Concern</h2>
          <p className="text-red-100 mb-8">See something unsafe? Report it immediately. Your safety report is confidential and helps protect everyone.</p>
          <a href="mailto:safety@eliteconstruction.com"
            className="inline-block bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Report Now
          </a>
        </div>
      </section>
    </>
  );
}
