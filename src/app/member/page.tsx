import type { Metadata } from "next";
import React from "react";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { getCollection } from '@/lib/db';

export const metadata: Metadata = {
  title: "Member Dashboard | Membership",
  description: "Member Dashboard",
};

// Benefit durations (days)
const BENEFIT_DURATIONS: Record<string, number> = {
  silver: 30,
  gold: 90,
  platinum: 365,
};

async function fetchMeServer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const payload = verifyToken(token as string);
    if (!payload) return null;

    const usersCollection = await getCollection('users');
    const { ObjectId } = require('mongodb');
    const userDoc = await usersCollection.findOne({ _id: new ObjectId(payload.id) });
    if (!userDoc) return null;

    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        benefit: userDoc.benefit || null,
        created_at: userDoc.created_at || null,
      }
    };
  } catch (err) {
    console.error('fetchMeServer error:', err);
    return null;
  }
}

export default async function MemberDashboard() {
  const me = await fetchMeServer();
  const user = me?.user || null;

  let remaining = null;
  if (user && user.benefit && user.created_at) {
    const created = new Date(user.created_at);
    const days = BENEFIT_DURATIONS[user.benefit] || 0;
    const expiry = new Date(created.getTime() + days * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    remaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <h1 className="text-2xl font-semibold">Welcome, {user?.email?.split('@')[0] || 'Member'}</h1>
        <p className="text-gray-600 mt-2">This is your member dashboard.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold">Benefit</h3>
        <p className="mt-2">
          {user?.benefit ? (
            <>Level: <strong>{user.benefit}</strong> — Remaining days: <strong>{remaining}</strong></>
          ) : (
            <>You have no benefit.</>
          )}
        </p>
      </div>
    </div>
  );
}
