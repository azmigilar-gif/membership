#!/usr/bin/env node

/**
 * MongoDB Seed Script
 * Creates admin user in MongoDB
 * 
 * Usage:
 * node scripts/seed.js "mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority"
 * OR if MONGODB_URI is in .env.local:
 * node scripts/seed.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Get MONGODB_URI from argument or .env.local
let mongodbUri = process.argv[2];

if (!mongodbUri) {
  // Try to load from .env.local
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    // Match both quoted and unquoted values
    const match = envContent.match(/MONGODB_URI\s*=\s*["']?(.+?)["']?\s*(\n|$)/);
    if (match) {
      mongodbUri = match[1].trim();
      // Remove surrounding quotes if present
      mongodbUri = mongodbUri.replace(/^["']|["']$/g, '');
    }
  }
}

if (!mongodbUri) {
  console.error('\n❌ MONGODB_URI not found!');
  console.error('\nUsage:');
  console.error('  node scripts/seed.js "mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority"');
  console.error('\nOr add MONGODB_URI to .env.local');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(mongodbUri);
  
  try {
    console.log('\n🔄 Connecting to MongoDB...');
    
    // Connect
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');

    const db = client.db('membership');
    const usersCollection = db.collection('users');

    console.log('\n🌱 Seeding database...');

    // Hash password
    const adminPassword = await bcrypt.hash('dunz123', 10);

    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    // Insert or update admin user
    const result = await usersCollection.updateOne(
      { email: 'dunzz@gmail.com' },
      {
        $set: {
          email: 'dunzz@gmail.com',
          password_hash: adminPassword,
          role: 'admin',
          is_active: true,
          updated_at: new Date(),
        },
        $setOnInsert: {
          created_at: new Date(),
        }
      },
      { upsert: true }
    );

    console.log(`✅ Admin user created/updated:`);
    console.log(`   📧 Email: dunzz@gmail.com`);
    console.log(`   🔑 Password: dunz123`);
    console.log(`   👤 Role: admin`);

    console.log('\n✨ Seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: dunzz@gmail.com');
    console.log('   Password: dunz123');
    console.log('   Role: admin');
    console.log('   Path: /admin');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Hint: Check if MONGODB_URI is set in .env.local');
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
