"use client";

import React, { useState } from "react";
import EditMemberModal from "./EditMemberModal";

export default function MembersTable({ users }: { users: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const toIdString = (id: any) => {
    if (!id) return String(id);
    if (typeof id === 'string') return id;
    if (id.$oid) return id.$oid;
    if (typeof id === 'object' && typeof id.toString === 'function') {
      const s = id.toString();
      if (s && s !== '[object Object]') return s;
    }
    return String(id);
  };

  const openEdit = (user: any) => {
    const idStr = toIdString(user._id);
    setSelected({ ...user, _id: idStr });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleUpdated = async () => {
    // simple page reload to refresh data (server component will re-fetch)
    window.location.reload();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const res = await fetch(`/api/admin-new/users/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, is_active: false }),
      });

      if (!res.ok) {
        alert('Failed to delete member');
        return;
      }

      window.location.reload();
    } catch (err) {
      alert('Error deleting member');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Email</th>
                <th className="p-2 whitespace-nowrap">Tier</th>
                <th className="p-2 whitespace-nowrap">Free play</th>
                <th className="p-2 whitespace-nowrap">Overnight used</th>
                <th className="p-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const idStr = toIdString(u._id);
                return (
                  <tr key={idStr} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 dark:text-white whitespace-nowrap">{u.name || '-'}</td>
                    <td className="p-2 dark:text-white whitespace-nowrap">{u.email}</td>
                    <td className="p-2 dark:text-white whitespace-nowrap">{u.benefit || u.membership_tier || '-'}</td>
                    <td className="p-2 dark:text-white whitespace-nowrap">{u.free_play_hours ?? 0}</td>
                    <td className="p-2 dark:text-white whitespace-nowrap">{u.overnight_rentals_used ?? 0}</td>
                    <td className="p-2 dark:text-white whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit({ ...u, _id: idStr })} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(idStr)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EditMemberModal user={selected} open={open} onClose={close} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
