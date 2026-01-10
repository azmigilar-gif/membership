#!/usr/bin/env node

/**
 * Database Migration Script
 * Set up MongoDB collections and indexes
 * 
 * Usage:
 * npx ts-node scripts/migrate.ts (uses MONGODB_URI from .env.local)
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

async function migrate() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 Starting database migration...');
    
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('membership');

    // Create users collection if it doesn't exist
    const collections = await db.listCollections().toArray();
    const usersCollectionExists = collections.some(c => c.name === 'users');

    if (!usersCollectionExists) {
      await db.createCollection('users');
      console.log('✅ Users collection created');
    } else {
      console.log('✅ Users collection already exists');
    }

    // Create unique index on email
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Email index created');

    console.log('\n✨ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: node scripts/seed.js');
    console.log('2. This will create the admin user');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
