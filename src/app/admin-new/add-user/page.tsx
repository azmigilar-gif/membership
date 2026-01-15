"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNewAddUser() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [benefit, setBenefit] = useState("");
  const [freePlayHours, setFreePlayHours] = useState<number | null>(null);
  const [overnightRentals, setOvernightRentals] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const benefitDefaults: Record<string, { hours: number; rentals: number }> = {
    platinum: { hours: 24, rentals: 1 },
    diamond: { hours: 48, rentals: 2 },
    ultimate: { hours: 120, rentals: 5 },
  };

  const handleBenefitChange = (value: string) => {
    setBenefit(value);
    if (value && benefitDefaults[value]) {
      const defaults = benefitDefaults[value];
      setFreePlayHours(defaults.hours);
      setOvernightRentals(defaults.rentals);
    } else {
      setFreePlayHours(null);
      setOvernightRentals(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          benefit: benefit || null,
          free_play_hours: freePlayHours,
          overnight_rentals_used: overnightRentals,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create user');
        setLoading(false);
        return;
      }

      await router.push('/admin-new');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Add User</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border" required />
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-2 border">
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
        <select value={benefit} onChange={e=>handleBenefitChange(e.target.value)} className="w-full p-2 border">
          <option value="">-- no benefit --</option>
          <option value="platinum">platinum (24h, 1x)</option>
          <option value="diamond">diamond (48h, 2x)</option>
          <option value="ultimate">ultimate (120h, 5x)</option>
        </select>
        {benefit && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Free play hours</label>
              <input type="number" value={freePlayHours ?? ''} onChange={e=>setFreePlayHours(e.target.value === '' ? null : Number(e.target.value))} className="w-full p-2 border" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overnight rentals</label>
              <input type="number" value={overnightRentals ?? ''} onChange={e=>setOvernightRentals(e.target.value === '' ? null : Number(e.target.value))} className="w-full p-2 border" placeholder="0" />
            </div>
          </>
        )}
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
