import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { getCollection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, benefit } = body;

    // Validation
    if (!name || !email || !password || !benefit) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!['silver', 'gold', 'platinum'].includes(benefit)) {
      return NextResponse.json(
        { error: 'Invalid benefit level' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const usersCollection = await getCollection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create member
    const result = await usersCollection.insertOne({
      name,
      email,
      password_hash,
      benefit,
      role: 'member',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Member registered successfully',
        member: {
          id: result.insertedId,
          name,
          email,
          benefit,
          role: 'member',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Member registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register member' },
      { status: 500 }
    );
  }
}
