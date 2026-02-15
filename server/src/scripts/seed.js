import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Entry from '../models/Entry.js';

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    passwordHash: 'password123'
  }
];

const sampleEntries = [
  {
    title: 'My First Journal Entry',
    content: 'Today was an amazing day! I started my journaling journey and I\'m feeling excited about documenting my thoughts and experiences. This is going to help me reflect on my personal growth.',
    mood: 'happy',
    tags: ['first', 'excited', 'growth'],
    entryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    title: 'Challenges at Work',
    content: 'Had a challenging day at work today. The project deadline is approaching and there\'s still so much to do. Feeling a bit overwhelmed but trying to stay positive. I know I can get through this.',
    mood: 'anxious',
    tags: ['work', 'challenge', 'stress'],
    entryDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  },
  {
    title: 'Gratitude Moment',
    content: 'Today I\'m feeling grateful for my family and friends. They support me through everything and I don\'t know what I\'d do without them. Sometimes we forget to appreciate the people who matter most.',
    mood: 'grateful',
    tags: ['gratitude', 'family', 'friends'],
    entryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    title: 'Weekend Adventure',
    content: 'Went hiking this weekend and it was incredible! The fresh air, beautiful views, and physical exercise really cleared my mind. Nature has such a powerful healing effect on me.',
    mood: 'excited',
    tags: ['hiking', 'nature', 'weekend'],
    entryDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    title: 'Peaceful Morning',
    content: 'Started the day with meditation and yoga. There\'s something so calming about beginning the morning with intention and mindfulness. I feel centered and ready to face whatever comes my way.',
    mood: 'calm',
    tags: ['meditation', 'yoga', 'mindfulness'],
    entryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    title: 'Frustrating Situation',
    content: 'Dealt with a frustrating customer service issue today. Sometimes it feels like nobody cares about doing their job properly. Had to take a few deep breaths to keep my cool.',
    mood: 'frustrated',
    tags: ['frustration', 'customer-service', 'annoying'],
    entryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    title: 'Reflection and Growth',
    content: 'Looking back at this week, I realize how much I\'ve grown. Even the challenging moments taught me valuable lessons. I\'m proud of myself for staying committed to journaling.',
    mood: 'neutral',
    tags: ['reflection', 'growth', 'weekly-review'],
    entryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    title: 'Today\'s Accomplishment',
    content: 'Finally completed that project I\'ve been working on for weeks! All the hard work paid off and my boss was really impressed. Feeling proud and accomplished today.',
    mood: 'happy',
    tags: ['accomplishment', 'work', 'success'],
    entryDate: new Date() // Today
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Entry.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const user of sampleUsers) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create entries for each user
    for (const user of createdUsers) {
      for (const entry of sampleEntries) {
        const newEntry = new Entry({
          ...entry,
          userId: user._id,
          // Vary the dates for each user
          entryDate: new Date(entry.entryDate.getTime() + Math.random() * 24 * 60 * 60 * 1000)
        });
        await newEntry.save();
      }
    }
    console.log(`Created ${sampleEntries.length} entries for each user`);

    // Make some entries pinned and favorites
    const allEntries = await Entry.find({});
    for (let i = 0; i < allEntries.length; i++) {
      if (i % 3 === 0) allEntries[i].pinned = true;
      if (i % 4 === 0) allEntries[i].favorite = true;
      await allEntries[i].save();
    }
    console.log('Set some entries as pinned/favorites');

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the seed function
seedDatabase();
