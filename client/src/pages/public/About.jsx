import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">About Us</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Who We Are</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Elite Construction is a trusted construction company based in Kigali, Rwanda, delivering quality projects since 2016.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">To deliver exceptional construction services that exceed client expectations through quality craftsmanship, innovation, and integrity.</p>
              <p className="text-gray-600">We believe in building long-term relationships with our clients by being transparent, reliable, and committed to excellence in every project we undertake.</p>
            </div>
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center text-gray-400">Image Placeholder</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Quality</h3>
              <p className="text-sm text-gray-600 mt-2">We never compromise on quality in any project.</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Integrity</h3>
              <p className="text-sm text-gray-600 mt-2">Honesty guides every interaction we have.</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Collaboration</h3>
              <p className="text-sm text-gray-600 mt-2">We work closely with clients and partners.</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Innovation</h3>
              <p className="text-sm text-gray-600 mt-2">Modern techniques and sustainable materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="text-gray-600 mt-2">Meet the people behind our success</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">David Mugisha</h3>
              <p className="text-sm text-blue-600">CEO & Founder</p>
              <p className="text-sm text-gray-600 mt-2">Over 20 years of experience in construction in East Africa.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">Grace Uwimana</h3>
              <p className="text-sm text-blue-600">COO</p>
              <p className="text-sm text-gray-600 mt-2">Expert in project management and operational excellence.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">Patrick Nsengimana</h3>
              <p className="text-sm text-blue-600">Head of Engineering</p>
              <p className="text-sm text-gray-600 mt-2">Licensed civil engineer in structural design.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">Alice Kabatesi</h3>
              <p className="text-sm text-blue-600">Head of Design</p>
              <p className="text-sm text-gray-600 mt-2">Award-winning architect in sustainable design.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">Jean Claude Habimana</h3>
              <p className="text-sm text-blue-600">Project Director</p>
              <p className="text-sm text-gray-600 mt-2">15+ years managing large-scale projects.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
              <h3 className="font-semibold text-gray-900">Diane Ishimwe</h3>
              <p className="text-sm text-blue-600">Head of Finance</p>
              <p className="text-sm text-gray-600 mt-2">Financial strategist ensuring project profitability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2016</div>
              <div className="text-gray-600">Company founded in Kigali, Rwanda with a team of 5 professionals.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2018</div>
              <div className="text-gray-600">Completed first major commercial project — Kacyiru Office Complex.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2020</div>
              <div className="text-gray-600">Expanded into infrastructure with the Northern Highway Project.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2022</div>
              <div className="text-gray-600">Team grew to 50+ professionals; opened regional office in Musanze.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2024</div>
              <div className="text-gray-600">Achieved ISO 9001 certification; completed 150+ projects.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-blue-600 font-bold text-lg w-16 shrink-0">2026</div>
              <div className="text-gray-600">Expanding operations into East African Community markets.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
