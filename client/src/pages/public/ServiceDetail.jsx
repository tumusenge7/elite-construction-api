import { useParams, Link } from 'react-router-dom';

const servicesData = {
  'residential-construction': {
    title: 'Residential Construction',
    desc: 'We build exceptional residential properties that combine aesthetic beauty with functional design. From luxury villas to multi-unit apartment complexes.',
    why: 'Your home is your most important investment. We ensure every aspect meets your expectations through careful planning and quality materials.',
    process: ['Consultation & needs assessment', 'Site evaluation & feasibility', 'Custom design & planning', 'Permitting & approvals', 'Construction & management', 'Final inspection & handover'],
    features: ['Custom architectural design', 'Premium materials & finishes', 'Energy-efficient solutions', 'Smart home integration', 'Landscaping & outdoor spaces', 'Quality warranties'],
  },
  'commercial-construction': {
    title: 'Commercial Construction',
    desc: 'Our commercial construction division delivers functional, efficient commercial spaces that support business success.',
    why: 'Commercial projects require precision and strict timelines. Our experienced team delivers spaces built to perform.',
    process: ['Business requirement analysis', 'Site selection support', 'Architectural & engineering design', 'Value engineering', 'Construction & fit-out', 'Commissioning & handover'],
    features: ['Modern office environments', 'Retail & hospitality spaces', 'Industrial facilities', 'Safety compliance', 'Sustainable practices', 'Flexible space planning'],
  },
  'renovation': {
    title: 'Renovation & Remodeling',
    desc: 'Transform your existing space with comprehensive renovation services. From single rooms to complete transformations.',
    why: 'Renovation requires understanding existing structures. Our experience ensures smooth execution and stunning results.',
    process: ['Property inspection & assessment', 'Design & scope definition', 'Material selection & budgeting', 'Demolition & preparation', 'Construction & installation', 'Finishing & decoration'],
    features: ['Kitchen & bathroom remodeling', 'Basement & attic conversion', 'Structural modifications', 'Plumbing & electrical upgrades', 'Flooring & tiling', 'Painting & decoration'],
  },
  'design-engineering': {
    title: 'Design & Engineering',
    desc: 'Comprehensive architectural and structural design services creating innovative, sustainable, and buildable designs.',
    why: 'Great buildings start with great design. Our team ensures thoughtful planning for success.',
    process: ['Concept development', 'Schematic design', 'Design development', 'Construction documents', 'Engineering reviews', 'Permit coordination'],
    features: ['Architectural design', 'Structural engineering', 'MEP engineering', '3D rendering', 'Sustainability analysis', 'Cost estimating'],
  },
  'infrastructure': {
    title: 'Infrastructure',
    desc: 'Critical infrastructure projects that connect communities and enable economic growth.',
    why: 'Infrastructure projects impact communities for generations. Our commitment ensures lasting value.',
    process: ['Feasibility study & survey', 'Environmental assessment', 'Detailed engineering design', 'Procurement & mobilization', 'Construction & quality control', 'Testing & commissioning'],
    features: ['Road & highway construction', 'Bridge & culvert construction', 'Water & sanitation systems', 'Drainage & flood control', 'Street lighting', 'Landscaping'],
  },
  'project-management': {
    title: 'Project Management',
    desc: 'Ensure your project is delivered on time, within budget, and to the highest quality standards.',
    why: 'Professional project management reduces risk and controls costs. Let us handle the complexities.',
    process: ['Project initiation & planning', 'Team assembly & procurement', 'Schedule & budget management', 'Quality & safety oversight', 'Progress monitoring', 'Closeout & handover'],
    features: ['Full-time site supervision', 'Cost control & reporting', 'Schedule management', 'Quality assurance', 'Safety management', 'Contract administration'],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = servicesData[slug];

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

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              <h3 className="font-bold text-gray-900 mb-3">Why Choose Us?</h3>
              <p className="text-gray-600">{service.why}</p>
            </div>
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
          </div>
        </div>
      </section>

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

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Contact us today to discuss your {service.title.toLowerCase()} project.</p>
          <Link to="/request-quote" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
            Get a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
