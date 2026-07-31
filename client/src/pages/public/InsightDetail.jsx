import { useParams, Link } from 'react-router-dom';

const postsData = {
  '10-essential-tips-for-planning-your-home-construction': {
    title: '10 Essential Tips for Planning Your Home Construction',
    category: 'Construction Tips', date: 'June 15, 2026', readTime: '5 min',
    author: 'David Mugisha',
    content: `
Building your dream home requires careful planning. Here are ten essential tips to help you navigate the process with confidence.

1. Define Your Budget Realistically
Establish a comprehensive budget including construction costs, permits, fees, and contingency funds (10-15%).

2. Choose the Right Location
The location affects everything from costs to daily living. Evaluate soil conditions, drainage, and accessibility.

3. Select a Reputable Builder
Research builders, check portfolios, read testimonials, and visit completed projects.

4. Invest in Good Design
Work with an experienced architect who understands your vision and future needs.

5. Plan for the Future
Consider long-term needs. Will your family grow? Planning ahead saves renovation costs.

6. Get Everything in Writing
Document all agreements, specifications, timelines, and payment schedules in a contract.

7. Communicate Regularly
Establish clear communication channels with your builder for regular progress updates.

8. Monitor Quality Closely
Visit your site regularly and understand materials and methods being used.

9. Prepare for Delays
Weather, material shortages, and site conditions can cause delays. Build flexibility into your timeline.

10. Enjoy the Process
Celebrate milestones and look forward to the day you walk through your front door.
    `,
  },
  'sustainable-building-practices-are-shaping-rwandas-future': {
    title: 'Sustainable Building Practices in Rwanda',
    category: 'Sustainability', date: 'June 10, 2026', readTime: '4 min',
    author: 'Alice Kabatesi',
    content: `
Sustainability is no longer a trend — it is a necessity. Rwanda's construction industry is embracing green building practices.

Energy Efficiency
Modern buildings incorporate solar panels, energy-efficient lighting, and smart HVAC systems that reduce energy consumption.

Water Conservation
Rainwater harvesting, low-flow fixtures, and greywater recycling are becoming standard in new developments.

Sustainable Materials
Locally sourced materials reduce emissions and support the local economy. Recycled materials are increasingly specified.

Green Building Certification
More developers seek LEED and EDGE certifications, increasing property values and environmental performance.

The future of construction in Rwanda is green. By embracing sustainable practices, we create buildings that are more comfortable, efficient, and valuable.
    `,
  },
  'inside-look-building-the-skyline-tower': {
    title: 'Inside Look: Building the Skyline Tower',
    category: 'Project Stories', date: 'May 28, 2026', readTime: '7 min',
    author: 'Patrick Nsengimana',
    content: `
The Skyline Tower stands as a testament to what can be achieved when vision meets expertise.

The Vision
Skyline Properties wanted a 12-story commercial tower in Kacyiru to redefine the skyline with world-class office space.

The Challenges
The site required deep pile foundations extending 25 meters. The project needed LEED Gold certification on an 18-month schedule.

The Innovation
A precast concrete facade system accelerated construction. Smart building management optimized energy use.

The Team
At peak, over 300 workers were on site daily with meticulous planning and clear communication.

The Result
Completed on schedule, Skyline Tower houses 30+ businesses and achieved LEED Gold certification.
    `,
  },
};

export default function InsightDetail() {
  const { slug } = useParams();
  const post = postsData[slug];

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The article you are looking for does not exist.</p>
        <Link to="/insights" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold">View All Insights</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/insights" className="text-blue-400 text-sm font-medium hover:underline mb-4 inline-block">&larr; Back to Insights</Link>
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full font-medium">{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">{post.title}</h1>
          <p className="text-gray-300 mt-3">By {post.author}</p>
        </div>
      </section>

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-gray-600 leading-relaxed space-y-4">
            {post.content.split('\n').filter(l => l.trim()).map((line, i) => {
              if (line.match(/^\d+\./)) {
                const [num, ...rest] = line.split('. ');
                return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{num}. {rest.join('. ')}</h3>;
              }
              if (line.match(/^[A-Z][a-z]+\s/) && line.length < 40) {
                return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line}</h3>;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      </article>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Have Questions?</h2>
          <p className="text-gray-300 mb-8">Our team is happy to discuss any construction questions or project ideas.</p>
          <Link to="/contact" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
