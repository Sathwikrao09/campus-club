require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Event.deleteMany({});

  const superadmin = await User.create({
    name: 'Dr. Shiva Aditya', email: 'admin@campus.edu',
    password: 'admin123', role: 'superadmin',
  });

  const clubAdmin1 = await User.create({
    name: 'Rahul Mehta', email: 'rahul@campus.edu',
    password: 'rahul123', role: 'clubadmin', clubName: 'Tech Club',
  });

  const clubAdmin2 = await User.create({
    name: 'Priya Nair', email: 'priya@campus.edu',
    password: 'priya123', role: 'clubadmin', clubName: 'Cultural Committee',
  });

  await User.create({
    name: 'Arjun Kumar', email: 'student@campus.edu',
    password: 'student123', role: 'student',
  });

  const events = [
    { name: 'Hackathon 2025', clubName: 'Tech Club', category: 'Technical', dateTime: new Date('2025-04-10T09:00:00'), venue: 'Seminar Hall A', description: '36-hour coding marathon with prizes worth ₹50,000. Open to all branches.', expectedAttendees: 200, status: 'approved', submittedBy: clubAdmin1._id, reviewedBy: superadmin._id },
    { name: 'Spring Cultural Fest', clubName: 'Cultural Committee', category: 'Cultural', dateTime: new Date('2025-04-15T17:00:00'), venue: 'Open Air Theatre', description: 'Annual spring celebration with dance, music, and drama performances.', expectedAttendees: 500, status: 'approved', submittedBy: clubAdmin2._id, reviewedBy: superadmin._id },
    { name: 'Inter-College Cricket', clubName: 'Sports Council', category: 'Sports', dateTime: new Date('2025-04-18T08:00:00'), venue: 'Sports Ground', description: 'Two-day cricket tournament with teams from 6 colleges.', expectedAttendees: 300, status: 'approved', submittedBy: superadmin._id },
    { name: 'Research Paper Symposium', clubName: 'IEEE Student Branch', category: 'Academic', dateTime: new Date('2025-04-22T10:00:00'), venue: 'Conference Room 101', description: 'Present your research to industry experts and win publication opportunities.', expectedAttendees: 80, status: 'pending', submittedBy: clubAdmin1._id },
    { name: 'One Act Play Competition', clubName: 'Drama Club', category: 'Cultural', dateTime: new Date('2025-04-25T18:30:00'), venue: 'Main Auditorium', description: 'Intra-college one-act play competition with a surprise theme reveal.', expectedAttendees: 250, status: 'pending', submittedBy: clubAdmin2._id },
    { name: 'Photography Walk', clubName: 'Photography Club', category: 'Social', dateTime: new Date('2025-04-12T06:00:00'), venue: 'Open Air Theatre', description: 'Early morning campus photography walk followed by an exhibition.', expectedAttendees: 40, status: 'approved', submittedBy: superadmin._id },
    { name: 'Blood Donation Camp', clubName: 'NSS Unit', category: 'Social', dateTime: new Date('2025-04-20T09:00:00'), venue: 'Seminar Hall B', description: 'Campus blood donation drive in collaboration with city hospital.', expectedAttendees: 150, status: 'rejected', submittedBy: clubAdmin2._id, reviewedBy: superadmin._id },
    { name: 'Battle of Bands', clubName: 'Music Society', category: 'Cultural', dateTime: new Date('2025-04-28T16:00:00'), venue: 'Open Air Theatre', description: 'Live band competition — register your band and play for 500+ students.', expectedAttendees: 400, status: 'pending', submittedBy: clubAdmin2._id },
  ];

  await Event.insertMany(events);
  console.log('✅ Database seeded!');
  console.log('\n📋 Test Accounts:');
  console.log('  Super Admin : admin@campus.edu    / admin123');
  console.log('  Club Admin  : rahul@campus.edu    / rahul123');
  console.log('  Club Admin  : priya@campus.edu    / priya123');
  console.log('  Student     : student@campus.edu  / student123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
