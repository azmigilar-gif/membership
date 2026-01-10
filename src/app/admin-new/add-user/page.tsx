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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, role, benefit: benefit || null }),
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
        <select value={benefit} onChange={e=>setBenefit(e.target.value)} className="w-full p-2 border">
          <option value="">-- no benefit --</option>
          <option value="silver">silver</option>
          <option value="gold">gold</option>
          <option value="platinum">platinum</option>
        </select>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
