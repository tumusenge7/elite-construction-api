require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Role = require('./models/Role');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Employee = require('./models/Employee');
const Service = require('./models/Service');
const Setting = require('./models/Setting');
const Faq = require('./models/Faq');
const Testimonial = require('./models/Testimonial');
const BlogCategory = require('./models/BlogCategory');

const connectDB = require('./config/database');

const seed = async () => {
  try {
    await connectDB();

    const hash = await bcrypt.hash('password123', 12);

    const roles = await Role.insertMany([
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Admin', description: 'Administrative access' },
      { name: 'Project Manager', description: 'Project management access' },
      { name: 'Engineer', description: 'Engineering access' },
      { name: 'Accountant', description: 'Financial access' },
      { name: 'Procurement Officer', description: 'Procurement access' },
      { name: 'Site Supervisor', description: 'Site supervision access' },
      { name: 'Customer', description: 'Customer portal access' },
    ]);

    const adminRole = roles.find(r => r.name === 'Super Admin');

    await User.create({
      email: 'admin@eliteconstruction.com',
      password: hash,
      firstName: 'Elite',
      lastName: 'Admin',
      phone: '+254700000000',
      role: adminRole._id,
      status: 'active',
    });

    const defaultServices = await Service.insertMany([
      {
        name: 'Residential Construction',
        slug: 'residential-construction',
        category: 'construction',
        description: 'Custom home building, renovations, and extensions tailored to your lifestyle.',
        benefits: 'Custom home design, room additions, kitchen remodeling, basement finishing, home renovations',
        sortOrder: 1,
      },
      {
        name: 'Commercial Construction',
        slug: 'commercial-construction',
        category: 'construction',
        description: 'Professional commercial construction services including offices, retail spaces, and industrial buildings.',
        benefits: 'Office buildings, retail spaces, industrial facilities, warehouses, medical buildings',
        sortOrder: 2,
      },
      {
        name: 'Interior Design',
        slug: 'interior-design',
        category: 'design',
        description: 'Transform your space with our professional interior design services.',
        benefits: 'Space planning, color consultation, furniture selection, lighting design, material selection',
        sortOrder: 3,
      },
      {
        name: 'Project Management',
        slug: 'project-management',
        category: 'management',
        description: 'End-to-end project management ensuring timely delivery and budget compliance.',
        benefits: 'Budget management, timeline planning, contractor coordination, quality control, risk management',
        sortOrder: 4,
      },
      {
        name: 'Landscaping',
        slug: 'landscaping',
        category: 'design',
        description: 'Beautiful outdoor spaces that complement your property and enhance curb appeal.',
        benefits: 'Garden design, patios and decks, irrigation systems, outdoor lighting, hardscaping',
        sortOrder: 5,
      },
      {
        name: 'Renovation & Remodeling',
        slug: 'renovation-remodeling',
        category: 'construction',
        description: 'Breathe new life into your existing space with our expert renovation services.',
        benefits: 'Kitchen remodeling, bathroom renovation, basement finishing, attic conversion, whole home renovation',
        sortOrder: 6,
      },
    ]);

    await Setting.insertMany([
      { settingKey: 'site_name', settingValue: 'Elite Construction', group: 'general', type: 'text' },
      { settingKey: 'site_description', settingValue: 'Premium Construction & Design Services', group: 'general', type: 'text' },
      { settingKey: 'contact_email', settingValue: 'info@eliteconstruction.com', group: 'contact', type: 'text' },
      { settingKey: 'contact_phone', settingValue: '+254712345678', group: 'contact', type: 'text' },
      { settingKey: 'contact_address', settingValue: 'Kenyatta Avenue, Nairobi, Kenya', group: 'contact', type: 'text' },
      { settingKey: 'working_hours', settingValue: 'Mon - Fri: 8:00 AM - 6:00 PM', group: 'general', type: 'text' },
      { settingKey: 'social_facebook', settingValue: '#', group: 'social', type: 'text' },
      { settingKey: 'social_twitter', settingValue: '#', group: 'social', type: 'text' },
      { settingKey: 'social_instagram', settingValue: '#', group: 'social', type: 'text' },
      { settingKey: 'social_linkedin', settingValue: '#', group: 'social', type: 'text' },
      { settingKey: 'cost_per_sqm', settingValue: '1500', group: 'estimator', type: 'text' },
      { settingKey: 'labor_rate', settingValue: '500', group: 'estimator', type: 'text' },
      { settingKey: 'material_rate', settingValue: '800', group: 'estimator', type: 'text' },
      { settingKey: 'contingency_percentage', settingValue: '10', group: 'estimator', type: 'text' },
    ]);

    await Faq.insertMany([
      { question: 'How long does a typical construction project take?', answer: 'Timelines vary by project scope. A standard residential home takes 6–12 months, while renovations may take 2–4 months.', category: 'project', sortOrder: 1, status: 'active' },
      { question: 'Do you provide free quotations?', answer: 'Yes, we provide free initial consultations and quotations for all projects.', category: 'pricing', sortOrder: 2, status: 'active' },
      { question: 'What areas do you serve?', answer: 'We serve all major urban areas across Kenya, including Nairobi, Mombasa, Kisumu, and surrounding regions.', category: 'general', sortOrder: 3, status: 'active' },
      { question: 'Are you licensed and insured?', answer: 'Yes, Elite Construction is fully licensed, bonded, and insured for all types of construction projects.', category: 'general', sortOrder: 4, status: 'active' },
      { question: 'Can I make changes during construction?', answer: 'Yes, changes can be made as part of our change order process, which may affect timeline and cost.', category: 'project', sortOrder: 5, status: 'active' },
      { question: 'What payment options do you offer?', answer: 'We offer flexible payment plans including milestone-based payments, financing options, and installment plans.', category: 'pricing', sortOrder: 6, status: 'active' },
    ]);

    await Testimonial.insertMany([
      { customerName: 'John Kamau', customerTitle: 'Homeowner', comment: 'Elite Construction built our dream home. Their attention to detail and professionalism exceeded our expectations.', rating: 5, status: 'approved' },
      { customerName: 'Mary Wanjiku', customerTitle: 'Business Owner', comment: 'They completed our office renovation on time and within budget. Highly recommended!', rating: 5, status: 'approved' },
      { customerName: 'David Omondi', customerTitle: 'Property Developer', comment: 'We have worked with Elite on multiple projects. Their project management is outstanding.', rating: 5, status: 'approved' },
    ]);

    const blogCategories = await BlogCategory.insertMany([
      { name: 'Construction Tips', slug: 'construction-tips', description: 'Helpful tips for your construction projects' },
      { name: 'Design Ideas', slug: 'design-ideas', description: 'Inspiring design ideas for your space' },
      { name: 'Industry News', slug: 'industry-news', description: 'Latest news in the construction industry' },
      { name: 'Project Showcase', slug: 'project-showcase', description: 'Showcasing our completed projects' },
    ]);

    console.log('Database seeded successfully!');
    console.log(`  ✓ ${roles.length} roles created`);
    console.log('  ✓ Admin user created (admin@eliteconstruction.com / password123)');
    console.log(`  ✓ ${defaultServices.length} services created`);
    console.log('  ✓ Settings created');
    console.log('  ✓ FAQs created');
    console.log('  ✓ Testimonials created');
    console.log(`  ✓ ${blogCategories.length} blog categories created`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
