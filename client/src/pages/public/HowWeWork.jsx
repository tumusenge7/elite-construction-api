import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Initial Consultation', phase: 'Phase 1',
    desc: 'We meet with you to understand your vision, requirements, budget, and timeline.',
    details: ['Site visit & assessment', 'Requirements gathering', 'Budget discussion', 'Timeline estimation', 'Feasibility analysis'],
  },
  {
    title: 'Site Analysis & Planning', phase: 'Phase 2',
    desc: 'Thorough site analysis, soil testing, and environmental assessments before design begins.',
    details: ['Soil investigation', 'Topographical survey', 'Environmental assessment', 'Utility mapping', 'Zoning & regulation check'],
  },
  {
    title: 'Design & Engineering', phase: 'Phase 3',
    desc: 'Detailed designs, structural plans, and 3D visualizations that bring your vision to life.',
    details: ['Architectural design', 'Structural engineering', '3D visualization', 'Material selection', 'Permit drawings'],
  },
  {
    title: 'Construction', phase: 'Phase 4',
    desc: 'Skilled workforce executes construction with rigorous quality control and safety standards.',
    details: ['Site mobilization', 'Foundation works', 'Structural construction', 'MEP installation', 'Interior finishing'],
  },
  {
    title: 'Quality Control', phase: 'Phase 5',
    desc: 'Regular inspections, material testing, and compliance checks throughout construction.',
    details: ['Material testing', 'Structural inspections', 'Safety audits', 'Progress reporting', 'Defect rectification'],
  },
  {
    title: 'Handover & Support', phase: 'Phase 6',
    desc: 'Final walkthrough, snag resolution, and comprehensive documentation with aftercare support.',
    details: ['Final inspection', 'Snag list resolution', 'Documentation handover', 'Warranty information', 'Aftercare support'],
  },
];

export default function HowWeWork() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Process</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">How We Work</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">A transparent, structured approach from concept to completion.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-600 text-sm font-semibold">{step.phase}</span>
                  <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{step.desc}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {step.details.map((d, j) => (
                    <div key={j} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-600 text-xs font-bold">{i + 1}.{j + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-300 mb-8">Take the first step toward your construction project.</p>
          <Link to="/request-quote" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
