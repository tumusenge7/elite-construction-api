// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const Role = require('./models/Role');
// const User = require('./models/User');
// const Customer = require('./models/Customer');
// const Employee = require('./models/Employee');
// const Service = require('./models/Service');
// const Setting = require('./models/Setting');
// const Faq = require('./models/Faq');
// const Testimonial = require('./models/Testimonial');
// const BlogCategory = require('./models/BlogCategory');

// const connectDB = require('./config/database');

// const seed = async () => {
//   try {
//     await connectDB();

//     const hash = await bcrypt.hash('password123', 12);

//     const roles = await Role.insertMany([
//       { name: 'Super Admin', description: 'Full system access' },
//       { name: 'Admin', description: 'Administrative access' },
//       { name: 'Project Manager', description: 'Project management access' },
//       { name: 'Engineer', description: 'Engineering access' },
//       { name: 'Accountant', description: 'Financial access' },
//       { name: 'Procurement Officer', description: 'Procurement access' },
//       { name: 'Site Supervisor', description: 'Site supervision access' },
//       { name: 'Customer', description: 'Customer portal access' },
//     ]);

//     const adminRole = roles.find(r => r.name === 'Super Admin');

//     await User.create({
//       email: 'admin@eliteconstruction.com',
//       password: hash,
//       firstName: 'Elite',
//       lastName: 'Admin',
//       phone: '+254700000000',
//       role: adminRole._id,
//       status: 'active',
//     });

//     const defaultServices = await Service.insertMany([
//       {
//         name: 'Residential Construction',
//         slug: 'residential-construction',
//         category: 'construction',
//         description: 'Custom homes, villas, townhouses, and apartment buildings crafted with premium materials and modern design.',
//         benefits: 'Custom home building, multi-unit residential, luxury villas, interior finishing',
//         image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 1,
//       },
//       {
//         name: 'Commercial Construction',
//         slug: 'commercial-construction',
//         category: 'construction',
//         description: 'Office buildings, retail centers, hotels, and industrial facilities for modern business needs.',
//         benefits: 'Office complexes, retail centers, hotels & hospitality, industrial facilities',
//         image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
//         videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
//         sortOrder: 2,
//       },
//       {
//         name: 'Renovation & Remodeling',
//         slug: 'renovation',
//         category: 'construction',
//         description: 'Transform existing spaces with comprehensive renovation services that breathe new life into old structures.',
//         benefits: 'Kitchen remodeling, bathroom renovation, full home renovation, commercial remodeling',
//         image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 3,
//       },
//       {
//         name: 'Design & Engineering',
//         slug: 'design-engineering',
//         category: 'design',
//         description: 'Architectural design, structural engineering, and project planning by licensed professionals.',
//         benefits: 'Architectural design, structural engineering, project planning, 3D visualization',
//         image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 4,
//       },
//       {
//         name: 'Infrastructure',
//         slug: 'infrastructure',
//         category: 'construction',
//         description: 'Roads, bridges, water supply systems, drainage, and public utilities built to last.',
//         benefits: 'Road construction, bridge building, water systems, public utilities',
//         image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
//         videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//         sortOrder: 5,
//       },
//       {
//         name: 'Project Management',
//         slug: 'project-management',
//         category: 'management',
//         description: 'End-to-end construction project management ensuring timelines, budgets, and quality standards are met.',
//         benefits: 'Budget management, timeline planning, quality control, risk management',
//         image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 6,
//       },
//       {
//         name: 'Landscaping',
//         slug: 'landscaping',
//         category: 'design',
//         description: 'Beautiful outdoor spaces that complement your property and enhance curb appeal.',
//         benefits: 'Garden design, patios and decks, irrigation systems, outdoor lighting, hardscaping',
//         image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 7,
//       },
//       {
//         name: 'Interior Design',
//         slug: 'interior-design',
//         category: 'design',
//         description: 'Transform your space with our professional interior design services.',
//         benefits: 'Space planning, color consultation, furniture selection, lighting design, material selection',
//         image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
//         videoUrl: '',
//         sortOrder: 8,
//       },
//     ]);

//     await Setting.insertMany([
//       { settingKey: 'site_name', settingValue: 'Elite Construction', group: 'general', type: 'text' },
//       { settingKey: 'site_description', settingValue: 'Premium Construction & Design Services', group: 'general', type: 'text' },
//       { settingKey: 'contact_email', settingValue: 'info@eliteconstruction.com', group: 'contact', type: 'text' },
//       { settingKey: 'contact_phone', settingValue: '+254712345678', group: 'contact', type: 'text' },
//       { settingKey: 'contact_address', settingValue: 'Kenyatta Avenue, Nairobi, Kenya', group: 'contact', type: 'text' },
//       { settingKey: 'working_hours', settingValue: 'Mon - Fri: 8:00 AM - 6:00 PM', group: 'general', type: 'text' },
//       { settingKey: 'social_facebook', settingValue: '#', group: 'social', type: 'text' },
//       { settingKey: 'social_twitter', settingValue: '#', group: 'social', type: 'text' },
//       { settingKey: 'social_instagram', settingValue: '#', group: 'social', type: 'text' },
//       { settingKey: 'social_linkedin', settingValue: '#', group: 'social', type: 'text' },
//       { settingKey: 'cost_per_sqm', settingValue: '1500', group: 'estimator', type: 'text' },
//       { settingKey: 'labor_rate', settingValue: '500', group: 'estimator', type: 'text' },
//       { settingKey: 'material_rate', settingValue: '800', group: 'estimator', type: 'text' },
//       { settingKey: 'contingency_percentage', settingValue: '10', group: 'estimator', type: 'text' },
//     ]);

//     await Faq.insertMany([
//       { question: 'How long does a typical construction project take?', answer: 'Timelines vary by project scope. A standard residential home takes 6–12 months, while renovations may take 2–4 months.', category: 'project', sortOrder: 1, status: 'active' },
//       { question: 'Do you provide free quotations?', answer: 'Yes, we provide free initial consultations and quotations for all projects.', category: 'pricing', sortOrder: 2, status: 'active' },
//       { question: 'What areas do you serve?', answer: 'We serve all major urban areas across Kenya, including Nairobi, Mombasa, Kisumu, and surrounding regions.', category: 'general', sortOrder: 3, status: 'active' },
//       { question: 'Are you licensed and insured?', answer: 'Yes, Elite Construction is fully licensed, bonded, and insured for all types of construction projects.', category: 'general', sortOrder: 4, status: 'active' },
//       { question: 'Can I make changes during construction?', answer: 'Yes, changes can be made as part of our change order process, which may affect timeline and cost.', category: 'project', sortOrder: 5, status: 'active' },
//       { question: 'What payment options do you offer?', answer: 'We offer flexible payment plans including milestone-based payments, financing options, and installment plans.', category: 'pricing', sortOrder: 6, status: 'active' },
//     ]);

//     await Testimonial.insertMany([
//       { customerName: 'John Kamau', customerTitle: 'Homeowner', comment: 'Elite Construction built our dream home. Their attention to detail and professionalism exceeded our expectations.', rating: 5, status: 'approved' },
//       { customerName: 'Mary Wanjiku', customerTitle: 'Business Owner', comment: 'They completed our office renovation on time and within budget. Highly recommended!', rating: 5, status: 'approved' },
//       { customerName: 'David Omondi', customerTitle: 'Property Developer', comment: 'We have worked with Elite on multiple projects. Their project management is outstanding.', rating: 5, status: 'approved' },
//     ]);

//     const blogCategories = await BlogCategory.insertMany([
//       { name: 'Construction Tips', slug: 'construction-tips', description: 'Helpful tips for your construction projects' },
//       { name: 'Design Ideas', slug: 'design-ideas', description: 'Inspiring design ideas for your space' },
//       { name: 'Industry News', slug: 'industry-news', description: 'Latest news in the construction industry' },
//       { name: 'Project Showcase', slug: 'project-showcase', description: 'Showcasing our completed projects' },
//     ]);

//     console.log('Database seeded successfully!');
//     console.log(`  ✓ ${roles.length} roles created`);
//     console.log('  ✓ Admin user created (admin@eliteconstruction.com / password123)');
//     console.log(`  ✓ ${defaultServices.length} services created`);
//     console.log('  ✓ Settings created');
//     console.log('  ✓ FAQs created');
//     console.log('  ✓ Testimonials created');
//     console.log(`  ✓ ${blogCategories.length} blog categories created`);

//     await mongoose.connection.close();
//     process.exit(0);
//   } catch (error) {
//     console.error('Seeding error:', error);
//     await mongoose.connection.close();
//     process.exit(1);
//   }
// };

// seed();













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

// ============================================
// HELPER: Seed with duplicate handling
// ============================================
async function seedCollection(model, data, uniqueField = 'name') {
  let inserted = 0;
  let skipped = 0;

  for (const item of data) {
    try {
      const filter = { [uniqueField]: item[uniqueField] };
      const exists = await model.findOne(filter);

      if (exists) {
        console.log(`⏭️ Skipped: ${item[uniqueField]} already exists`);
        skipped++;
      } else {
        await model.create(item);
        console.log(`✅ Created: ${item[uniqueField]}`);
        inserted++;
      }
    } catch (error) {
      if (error.code === 11000) {
        console.log(`⏭️ Skipped: ${item[uniqueField]} already exists (duplicate error)`);
        skipped++;
      } else {
        throw error;
      }
    }
  }

  console.log(`📊 ${model.modelName}: ${inserted} inserted, ${skipped} skipped`);
  return { inserted, skipped };
}

const seed = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected\n');

    // ============================================
    // 1. SEED ROLES
    // ============================================
    console.log('📝 Seeding roles...');
    const roleData = [
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Admin', description: 'Administrative access' },
      { name: 'Project Manager', description: 'Project management access' },
      { name: 'Engineer', description: 'Engineering access' },
      { name: 'Accountant', description: 'Financial access' },
      { name: 'Procurement Officer', description: 'Procurement access' },
      { name: 'Site Supervisor', description: 'Site supervision access' },
      { name: 'Customer', description: 'Customer portal access' },
    ];

    await seedCollection(Role, roleData, 'name');

    // Get the Super Admin role for user creation
    const adminRole = await Role.findOne({ name: 'Super Admin' });
    if (!adminRole) {
      console.error('❌ Super Admin role not found!');
      process.exit(1);
    }

    // ============================================
    // 2. SEED ADMIN USER
    // ============================================
    console.log('\n📝 Seeding admin user...');
    const adminEmail = 'admin@eliteconstruction.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`⏭️ Admin user "${adminEmail}" already exists, skipping...`);
    } else {
      const hash = await bcrypt.hash('password123', 12);
      await User.create({
        email: adminEmail,
        password: hash,
        firstName: 'Elite',
        lastName: 'Admin',
        phone: '+254700000000',
        role: adminRole._id,
        status: 'active',
      });
      console.log(`✅ Created admin user: ${adminEmail}`);
    }

    // ============================================
    // 3. SEED SERVICES
    // ============================================
    console.log('\n📝 Seeding services...');
    const serviceData = [
      {
        name: 'Residential Construction',
        slug: 'residential-construction',
        category: 'construction',
        description: 'Custom homes, villas, townhouses, and apartment buildings crafted with premium materials and modern design.',
        benefits: 'Custom home building, multi-unit residential, luxury villas, interior finishing',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        videoUrl: '',
        sortOrder: 1,
      },
      {
        name: 'Commercial Construction',
        slug: 'commercial-construction',
        category: 'construction',
        description: 'Office buildings, retail centers, hotels, and industrial facilities for modern business needs.',
        benefits: 'Office complexes, retail centers, hotels & hospitality, industrial facilities',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
        videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        sortOrder: 2,
      },
      {
        name: 'Renovation & Remodeling',
        slug: 'renovation',
        category: 'construction',
        description: 'Transform existing spaces with comprehensive renovation services that breathe new life into old structures.',
        benefits: 'Kitchen remodeling, bathroom renovation, full home renovation, commercial remodeling',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
        videoUrl: '',
        sortOrder: 3,
      },
      {
        name: 'Design & Engineering',
        slug: 'design-engineering',
        category: 'design',
        description: 'Architectural design, structural engineering, and project planning by licensed professionals.',
        benefits: 'Architectural design, structural engineering, project planning, 3D visualization',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
        videoUrl: '',
        sortOrder: 4,
      },
      {
        name: 'Infrastructure',
        slug: 'infrastructure',
        category: 'construction',
        description: 'Roads, bridges, water supply systems, drainage, and public utilities built to last.',
        benefits: 'Road construction, bridge building, water systems, public utilities',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        sortOrder: 5,
      },
      {
        name: 'Project Management',
        slug: 'project-management',
        category: 'management',
        description: 'End-to-end construction project management ensuring timelines, budgets, and quality standards are met.',
        benefits: 'Budget management, timeline planning, quality control, risk management',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        videoUrl: '',
        sortOrder: 6,
      },
      {
        name: 'Landscaping',
        slug: 'landscaping',
        category: 'design',
        description: 'Beautiful outdoor spaces that complement your property and enhance curb appeal.',
        benefits: 'Garden design, patios and decks, irrigation systems, outdoor lighting, hardscaping',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        videoUrl: '',
        sortOrder: 7,
      },
      {
        name: 'Interior Design',
        slug: 'interior-design',
        category: 'design',
        description: 'Transform your space with our professional interior design services.',
        benefits: 'Space planning, color consultation, furniture selection, lighting design, material selection',
        image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
        videoUrl: '',
        sortOrder: 8,
      },
    ];

    await seedCollection(Service, serviceData, 'slug');

    // ============================================
    // 4. SEED SETTINGS
    // ============================================
    console.log('\n📝 Seeding settings...');
    const settingData = [
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
    ];

    await seedCollection(Setting, settingData, 'settingKey');

    // ============================================
    // 5. SEED FAQS
    // ============================================
    console.log('\n📝 Seeding FAQs...');
    const faqData = [
      { question: 'How long does a typical construction project take?', answer: 'Timelines vary by project scope. A standard residential home takes 6–12 months, while renovations may take 2–4 months.', category: 'project', sortOrder: 1, status: 'active' },
      { question: 'Do you provide free quotations?', answer: 'Yes, we provide free initial consultations and quotations for all projects.', category: 'pricing', sortOrder: 2, status: 'active' },
      { question: 'What areas do you serve?', answer: 'We serve all major urban areas across Kenya, including Nairobi, Mombasa, Kisumu, and surrounding regions.', category: 'general', sortOrder: 3, status: 'active' },
      { question: 'Are you licensed and insured?', answer: 'Yes, Elite Construction is fully licensed, bonded, and insured for all types of construction projects.', category: 'general', sortOrder: 4, status: 'active' },
      { question: 'Can I make changes during construction?', answer: 'Yes, changes can be made as part of our change order process, which may affect timeline and cost.', category: 'project', sortOrder: 5, status: 'active' },
      { question: 'What payment options do you offer?', answer: 'We offer flexible payment plans including milestone-based payments, financing options, and installment plans.', category: 'pricing', sortOrder: 6, status: 'active' },
    ];

    await seedCollection(Faq, faqData, 'question');

    // ============================================
    // 6. SEED TESTIMONIALS
    // ============================================
    console.log('\n📝 Seeding testimonials...');
    const testimonialData = [
      { customerName: 'John Kamau', customerTitle: 'Homeowner', comment: 'Elite Construction built our dream home. Their attention to detail and professionalism exceeded our expectations.', rating: 5, status: 'approved' },
      { customerName: 'Mary Wanjiku', customerTitle: 'Business Owner', comment: 'They completed our office renovation on time and within budget. Highly recommended!', rating: 5, status: 'approved' },
      { customerName: 'David Omondi', customerTitle: 'Property Developer', comment: 'We have worked with Elite on multiple projects. Their project management is outstanding.', rating: 5, status: 'approved' },
    ];

    await seedCollection(Testimonial, testimonialData, 'customerName');

    // ============================================
    // 7. SEED BLOG CATEGORIES
    // ============================================
    console.log('\n📝 Seeding blog categories...');
    const blogCategoryData = [
      { name: 'Construction Tips', slug: 'construction-tips', description: 'Helpful tips for your construction projects' },
      { name: 'Design Ideas', slug: 'design-ideas', description: 'Inspiring design ideas for your space' },
      { name: 'Industry News', slug: 'industry-news', description: 'Latest news in the construction industry' },
      { name: 'Project Showcase', slug: 'project-showcase', description: 'Showcasing our completed projects' },
    ];

    await seedCollection(BlogCategory, blogCategoryData, 'slug');

    // ============================================
    // 8. SEED CUSTOMERS (Optional)
    // ============================================
    console.log('\n📝 Seeding customers...');
    const customerData = [
      { name: 'John Kamau', email: 'john@example.com', phone: '+254700000001', address: 'Nairobi, Kenya' },
      { name: 'Mary Wanjiku', email: 'mary@example.com', phone: '+254700000002', address: 'Mombasa, Kenya' },
      { name: 'Peter Ochieng', email: 'peter@example.com', phone: '+254700000003', address: 'Kisumu, Kenya' },
    ];

    try {
      await seedCollection(Customer, customerData, 'email');
    } catch (error) {
      console.log('⚠️ Customer model not found or error seeding:', error.message);
    }

    // ============================================
    // 9. SEED EMPLOYEES (Optional)
    // ============================================
    console.log('\n📝 Seeding employees...');
    const employeeData = [
      { name: 'James Mwangi', email: 'james@eliteconstruction.com', position: 'Project Manager', department: 'Construction' },
      { name: 'Grace Akinyi', email: 'grace@eliteconstruction.com', position: 'Engineer', department: 'Engineering' },
      { name: 'Michael Odhiambo', email: 'michael@eliteconstruction.com', position: 'Site Supervisor', department: 'Construction' },
    ];

    try {
      await seedCollection(Employee, employeeData, 'email');
    } catch (error) {
      console.log('⚠️ Employee model not found or error seeding:', error.message);
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n✅ Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: admin@eliteconstruction.com`);
    console.log(`   Password: password123`);
    console.log(`   Role: Super Admin`);

    // Get counts
    const counts = {
      roles: await Role.countDocuments(),
      users: await User.countDocuments(),
      services: await Service.countDocuments(),
      settings: await Setting.countDocuments(),
      faqs: await Faq.countDocuments(),
      testimonials: await Testimonial.countDocuments(),
      blogCategories: await BlogCategory.countDocuments(),
    };

    console.log('\n📊 Database Summary:');
    console.log(`   Roles: ${counts.roles}`);
    console.log(`   Users: ${counts.users}`);
    console.log(`   Services: ${counts.services}`);
    console.log(`   Settings: ${counts.settings}`);
    console.log(`   FAQs: ${counts.faqs}`);
    console.log(`   Testimonials: ${counts.testimonials}`);
    console.log(`   Blog Categories: ${counts.blogCategories}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
