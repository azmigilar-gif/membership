import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { getCollection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, benefit } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const existing = await usersCollection.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);

    const doc: any = {
      name,
      email,
      password_hash,
      role,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    if (benefit) doc.benefit = benefit;

    const result = await usersCollection.insertOne(doc);

    return NextResponse.json({ message: 'User created', id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error('Admin create user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
