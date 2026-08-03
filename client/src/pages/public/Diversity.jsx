
import { Users, Globe, GraduationCap, Accessibility, Handshake, BookOpen } from 'lucide-react';

const pillars = [
  { icon: Users, title: 'Women in Construction', desc: 'We actively recruit, develop, and promote women in all roles — from site workers to senior management.' },
  { icon: Globe, title: 'Local Hiring', desc: 'We prioritize hiring from local communities near our project sites, creating economic opportunity where it matters most.' },
  { icon: GraduationCap, title: 'Youth Development', desc: 'Our apprenticeship and graduate programs give young Rwandans a pathway into the construction industry.' },
  { icon: Accessibility, title: 'Inclusive Workplaces', desc: 'We design our sites and offices to be accessible and welcoming to people of all abilities.' },
  { icon: Handshake, title: 'Equal Pay', desc: 'We conduct annual pay equity reviews to ensure all employees are compensated fairly regardless of gender or background.' },
  { icon: BookOpen, title: 'Cultural Respect', desc: 'We celebrate Rwanda\'s rich cultural diversity and create an environment where everyone feels valued and respected.' },
];

export default function Diversity() {
  return (
    <>
      <section className="bg-gradient-to-br from-purple-900 to-purple-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider">Diversity & Inclusion</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-5">Building a Team as Diverse as Rwanda</h1>
            <p className="text-purple-100 text-lg leading-relaxed">
              We believe that diverse teams build better buildings. At Elite Construction, inclusion isn't a policy — it's how we work every day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our D&I Pillars</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="bg-purple-50 border border-purple-100 p-6 rounded-xl hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex justify-center mb-4"><p.icon className="w-9 h-9 text-purple-600" /></div>
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
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Numbers</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '38', label: 'Women in workforce' },
                  { value: '95', label: 'Local employees' },
                  { value: '120', label: 'Youth trained annually' },
                  { value: '12', label: 'Nationalities represented' },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-purple-600">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
              alt="Diverse team" className="rounded-2xl shadow-xl w-full object-cover h-80" />
          </div>
        </div>
      </section>
    </>
  );
}
