import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getCollection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Fetch latest user record from DB to include benefit and created_at
    try {
      const usersCollection = await getCollection('users');
      const { ObjectId } = require('mongodb');
      const userDoc = await usersCollection.findOne({ _id: new ObjectId(payload.id) });

      if (!userDoc) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          benefit: userDoc.benefit || null,
          created_at: userDoc.created_at || null,
        },
      });
    } catch (err) {
      console.error('Error fetching user in /api/auth/me:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
