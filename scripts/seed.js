// Seed script for development
// Run with: node scripts/seed.js

// Note: Install axios first with: npm install axios
// Or use: node -r esm scripts/seed.js if using ES modules
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function seed() {
  console.log('🌱 Starting seed script...');

  try {
    // Register test users
    const users = [
      { username: 'panda1', email: 'panda1@example.com', password: 'password123' },
      { username: 'panda2', email: 'panda2@example.com', password: 'password123' },
      { username: 'panda3', email: 'panda3@example.com', password: 'password123' },
    ];

    const registeredUsers = [];
    for (const userData of users) {
      try {
        const response = await axios.post(`${API_URL}/api/v1/users/register`, userData);
        registeredUsers.push(response.data.data);
        console.log(`✅ Registered user: ${userData.username}`);
      } catch (error) {
        console.log(`⚠️  User ${userData.username} might already exist`);
      }
    }

    // Create posts for each user
    for (const user of registeredUsers) {
      const token = user.token;
      const posts = [
        {
          title: `Welcome to ${user.user.username}'s Blog`,
          content: `This is my first blog post on Panda Blog! I'm excited to share my thoughts and ideas with everyone.`,
          tags: ['welcome', 'first-post'],
        },
        {
          title: 'Getting Started with Microservices',
          content: `Microservices architecture is a great way to build scalable applications. Let me share some insights...`,
          tags: ['microservices', 'architecture', 'tech'],
        },
      ];

      for (const postData of posts) {
        try {
          await axios.post(
            `${API_URL}/api/v1/posts`,
            {
              ...postData,
              featuredImage: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop',
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(`✅ Created post: ${postData.title}`);
        } catch (error) {
          console.error(`❌ Failed to create post: ${error.message}`);
        }
      }
    }

    console.log('✅ Seed script completed!');
  } catch (error) {
    console.error('❌ Seed script failed:', error.message);
    process.exit(1);
  }
}

seed();

