require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const TeamMember = require('../src/models/TeamMember');

const seedData = [
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

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elite_construction';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    let count = 0;
    for (let i = 0; i < seedData.length; i++) {
      const member = seedData[i];
      const existing = await TeamMember.findOne({ name: member.name });
      if (existing) {
        existing.role = member.role;
        existing.dept = member.dept;
        existing.bio = member.bio;
        existing.order = i + 1;
        existing.status = 'active';
        await existing.save();
      } else {
        await TeamMember.create({ ...member, order: i + 1, status: 'active' });
      }
      count++;
    }

    console.log(`Seeded/updated ${count} team members`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
