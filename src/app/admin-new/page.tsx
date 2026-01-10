import type { Metadata } from "next";
import { getCollection } from '@/lib/db';

export const metadata: Metadata = {
  title: "Admin (New) | Membership",
  description: "Fresh admin page",
};

function formatDate(d: any) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleString();
}

export default async function AdminNewPage() {
  const usersCollection = await getCollection('users');
  const users = await usersCollection.find({}, { projection: { password_hash: 0 } }).toArray();

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin (New)</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">User list</p>
        </div>
        <div>
          <a href="/admin-new/add-user" className="px-4 py-2 bg-blue-600 text-white rounded">Add user</a>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Benefit</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u._id.toString()} className="border-b">
                <td className="p-2">{u.name || '-'}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.benefit || '-'}</td>
                <td className="p-2">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
