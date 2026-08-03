import { Link } from 'react-router-dom';
import { Recycle, Zap, Droplets, TreeDeciduous, Building2, LineChart } from 'lucide-react';

const commitments = [
  { icon: Recycle, title: 'Waste Reduction', desc: 'We divert 80%+ of construction waste from landfills through recycling and reuse programs on every project site.' },
  { icon: Zap, title: 'Energy Efficiency', desc: 'All our projects incorporate energy-efficient designs, LED lighting, and smart building management systems.' },
  { icon: Droplets, title: 'Water Conservation', desc: 'Rainwater harvesting, greywater recycling, and low-flow fixtures are standard in our residential and commercial builds.' },
  { icon: TreeDeciduous, title: 'Green Spaces', desc: 'We integrate landscaping, rooftop gardens, and urban green spaces into every development we deliver.' },
  { icon: Building2, title: 'Sustainable Materials', desc: 'We source locally produced, certified sustainable materials to reduce carbon footprint and support local industry.' },
  { icon: LineChart, title: 'Carbon Tracking', desc: 'We measure and report carbon emissions on all major projects, working toward net-zero construction by 2030.' },
];

const certifications = [
  { name: 'Green Building Council Rwanda', year: '2022' },
  { name: 'ISO 14001 Environmental Management', year: '2021' },
  { name: 'EDGE Certified Projects', year: '2023' },
  { name: 'Rwanda Climate Innovation Award', year: '2023' },
];

export default function Sustainability() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-green-900 to-green-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-green-300 font-semibold text-sm uppercase tracking-wider">Our Commitment</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-5">Building a Sustainable Future</h1>
            <p className="text-green-100 text-lg leading-relaxed">
              Sustainability isn't an add-on at Elite Construction — it's embedded in every decision we make, from design to delivery. We're committed to building structures that are good for people and the planet.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Green Commitments</h2>
            <p className="text-gray-500 mt-2">Six pillars of our sustainability strategy</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((c, i) => (
              <div key={i} className="bg-green-50 border border-green-100 p-6 rounded-xl hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex justify-center mb-4"><c.icon className="w-9 h-9 text-green-600" /></div>
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our 2030 Goals</h2>
              <div className="space-y-4">
                {[
                  { goal: 'Net-Zero Carbon Construction', progress: 45 },
                  { goal: '100% Renewable Energy on Sites', progress: 62 },
                  { goal: 'Zero Waste to Landfill', progress: 78 },
                  { goal: 'All Projects EDGE Certified', progress: 55 },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-800">{g.goal}</span>
                      <span className="text-green-600 font-semibold">{g.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Sustainable building" className="rounded-2xl shadow-xl w-full object-cover h-80" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Certifications & Recognition</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((c, i) => (
              <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                <p className="text-green-600 text-xs mt-1">Since {c.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want a Green Building?</h2>
          <p className="text-green-100 mb-8">Talk to our sustainability team about incorporating green features into your next project.</p>
          <Link to="/contact" className="inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
