import { Link } from 'react-router-dom';

const categories = ['All', 'Construction Tips', 'Industry News', 'Project Stories', 'Sustainability', 'Design'];

const posts = [
  {
    title: '10 Essential Tips for Planning Your Home Construction',
    category: 'Construction Tips', date: 'June 15, 2026', readTime: '5 min',
    excerpt: 'From budgeting to material selection, here are ten essential tips for a smooth construction project.',
    author: 'David Mugisha',
    slug: '10-essential-tips-for-planning-your-home-construction',
  },
  {
    title: 'Sustainable Building Practices in Rwanda',
    category: 'Sustainability', date: 'June 10, 2026', readTime: '4 min',
    excerpt: 'How sustainable construction practices are transforming Rwanda\'s building industry.',
    author: 'Alice Kabatesi',
    slug: 'sustainable-building-practices-are-shaping-rwandas-future',
  },
  {
    title: 'Inside Look: Building the Skyline Tower',
    category: 'Project Stories', date: 'May 28, 2026', readTime: '7 min',
    excerpt: 'Behind the scenes of Kigali\'s newest landmark construction.',
    author: 'Patrick Nsengimana',
    slug: 'inside-look-building-the-skyline-tower',
  },
  {
    title: 'Modern Architectural Trends in East Africa',
    category: 'Design', date: 'May 20, 2026', readTime: '6 min',
    excerpt: 'From minimalist facades to smart building integration.',
    author: 'Marie Claire Uwase',
    slug: 'modern-architectural-trends-in-east-africa-for-2026',
  },
  {
    title: 'How to Choose the Right Construction Partner',
    category: 'Construction Tips', date: 'May 12, 2026', readTime: '4 min',
    excerpt: 'A guide to evaluating contractors and making an informed decision.',
    author: 'Grace Uwimana',
    slug: 'how-to-choose-the-right-construction-partner',
  },
];

export default function Insights() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Our Insights</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Expert perspectives and practical guides from our team.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <button key={cat} className={`px-5 py-2 rounded-full text-sm font-medium ${cat === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link key={i} to={`/insights/${post.slug}`} className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md">
                <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 mb-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{post.excerpt}</p>
                  <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">By {post.author}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
