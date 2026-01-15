"use client";

import React, { useState } from "react";

type Props = {
  userId: string;
  initialValues: {
    benefit?: string;
    free_play_hours?: number;
    overnight_rentals_used?: number;
  };
  onSuccess?: () => void;
};

const benefits = [
  { value: "platinum", label: "Platinum Benefit" },
  { value: "diamond", label: "Diamond Benefit" },
  { value: "ultimate", label: "Ultimate Gold" },
];

export default function MemberForm({ userId, initialValues, onSuccess }: Props) {
  const [benefit, setBenefit] = useState(initialValues.benefit || "platinum");
  const [freePlay, setFreePlay] = useState<string | number>(initialValues.free_play_hours || 0);
  const [rentals, setRentals] = useState<string | number>(initialValues.overnight_rentals_used || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!userId) {
        setError("Missing id");
        setLoading(false);
        return;
      }
      const idStr = typeof userId === 'string' ? userId : String(userId);
      if (!idStr || idStr === 'undefined' || idStr === 'null') {
        setError('Missing id');
        setLoading(false);
        return;
      }
      console.debug('MemberForm submitting to', `/api/admin/users/${idStr}`);
      const res = await fetch(`/api/admin-new/users/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idStr,
          benefit,
          free_play_hours: freePlay === '' ? 0 : Number(freePlay),
          overnight_rentals_used: rentals === '' ? 0 : Number(rentals),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
        setLoading(false);
        return;
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Membership Tier</label>
        <select
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
        >
          {benefits.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Free play hours</label>
        <input
          type="number"
          min="0"
          value={freePlay}
          onChange={(e) => setFreePlay(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Overnight rentals used</label>
        <input
          type="number"
          min="0"
          value={rentals}
          onChange={(e) => setRentals(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2"
          placeholder="0"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
