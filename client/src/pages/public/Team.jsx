const teamMembers = [
  { name: 'David Mugisha', role: 'CEO & Founder', dept: 'Leadership', bio: 'Over 20 years of experience in construction and real estate development.' },
  { name: 'Grace Uwimana', role: 'COO', dept: 'Leadership', bio: 'Expert in operational excellence with a track record of driving organizational growth.' },
  { name: 'Patrick Nsengimana', role: 'Head of Engineering', dept: 'Engineering', bio: 'Licensed civil engineer who has led engineering for over 50 major projects.' },
  { name: 'Alice Kabatesi', role: 'Head of Design', dept: 'Design', bio: 'Award-winning architect with 15 years of experience in sustainable design.' },
  { name: 'Jean Claude Habimana', role: 'Project Director', dept: 'Management', bio: '15+ years managing large-scale construction projects.' },
  { name: 'Diane Ishimwe', role: 'Head of Finance', dept: 'Finance', bio: 'Chartered accountant with expertise in construction finance.' },
  { name: 'Eric Bayisenge', role: 'Senior Structural Engineer', dept: 'Engineering', bio: 'Specializes in structural analysis and design of concrete and steel structures.' },
  { name: 'Marie Claire Uwase', role: 'Lead Architect', dept: 'Design', bio: 'Registered architect focusing on modern African architectural aesthetics.' },
  { name: 'Samuel Niyonzima', role: 'Senior Project Manager', dept: 'Management', bio: 'PMP certified professional managing multi-million dollar projects.' },
  { name: 'Joseline Mutesi', role: 'Interior Design Lead', dept: 'Design', bio: 'Creative designer transforming spaces with innovative concepts.' },
  { name: 'Olivier Kayumba', role: 'MEP Engineer', dept: 'Engineering', bio: 'Mechanical, electrical, and plumbing engineering expert.' },
  { name: 'Chantal Nyiraneza', role: 'Quantity Surveyor', dept: 'Finance', bio: 'Expert in cost estimation, procurement, and contract administration.' },
];

export default function Team() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Meet Our Professionals</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">A dedicated team committed to excellence in every project.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
