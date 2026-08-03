import { useState, useEffect } from 'react';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/team-members');
        const json = await res.json();
        setMembers(json.data || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3b82f6] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member, i) => (
                <div key={member._id || i} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-16 h-16 rounded-2xl object-cover mb-4" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
