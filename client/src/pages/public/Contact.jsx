import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contact } from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contact.submit(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Get In Touch</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Have a question or ready to start a project? Reach out to us and we'll respond within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Address', value: 'KG 123 Ave, Kacyiru, Kigali, Rwanda' },
                  { icon: Phone, label: 'Phone', value: '+250 790122828' },
                  { icon: Mail, label: 'Email', value: 'blaisejavi7@gmail.com' },
                  { icon: Clock, label: 'Working Hours', value: 'Mon–Fri: 7:00 AM – 5:00 PM\nSat: 8:00 AM – 12:00 PM' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                    <item.icon className="w-6 h-6 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-blue-600 rounded-xl text-white">
                <h3 className="font-bold mb-2">Emergency Contact</h3>
                <p className="text-sm text-blue-100">For urgent site issues, call our 24/7 hotline:</p>
                <p className="text-lg font-bold mt-1">+250 788 111 000</p>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4"></div>
                  <h3 className="text-xl font-bold text-green-800">Message Sent!</h3>
                  <p className="text-sm text-green-600 mt-2">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-6 text-sm text-blue-600 hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject </label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Message </label>
                    <textarea name="message" rows={5} value={form.message} onChange={handleChange} required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all hover:scale-[1.01]">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
