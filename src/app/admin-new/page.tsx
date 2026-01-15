import type { Metadata } from "next";
import { getCollection } from '@/lib/db';
import MembersTable from '@/components/admin/MembersTable';

export const metadata: Metadata = {
  title: "Admin | Membership",
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">User list</p>
        </div>
        <div>
          <a href="/admin-new/add-user" className="px-4 py-2 bg-blue-600 text-white rounded">Add user</a>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Admin Users</h2>
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
                {users.filter((u: any) => u.role === 'admin').map((u: any) => (
                  <tr key={u._id.toString()} className="border-b">
                    <td className="p-2 dark:text-white">{u.name || '-'}</td>
                    <td className="p-2 dark:text-white">{u.email}</td>
                    <td className="p-2 dark:text-white">{u.role}</td>
                    <td className="p-2 dark:text-white">{u.benefit || '-'}</td>
                    <td className="p-2 dark:text-white">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Members</h2>
          {
            // Convert server-side Mongo objects into plain serializable objects
          }
          {(() => {
            const memberUsers = users
              .filter((u: any) => u.role === 'member')
              .map((u: any) => {
                // normalize _id to a 24-char hex string where possible
                let idVal: any = u._id;
                let idStr = '';
                if (!idVal) idStr = '';
                else if (typeof idVal === 'string') idStr = idVal;
                else if (idVal.$oid) idStr = String(idVal.$oid);
                else if (typeof idVal.toHexString === 'function') idStr = idVal.toHexString();
                else if (typeof idVal.toString === 'function') {
                  const s = idVal.toString();
                  const m = s.match(/[a-fA-F0-9]{24}/);
                  idStr = m ? m[0] : s;
                } else {
                  idStr = String(idVal);
                }

                return {
                  _id: idStr,
                  name: u.name || null,
                  email: u.email || null,
                  role: u.role || null,
                  benefit: u.benefit || u.membership_tier || null,
                  free_play_hours: typeof u.free_play_hours !== 'undefined' ? u.free_play_hours : null,
                  overnight_rentals_used: typeof u.overnight_rentals_used !== 'undefined' ? u.overnight_rentals_used : null,
                  subscription_start: u.subscription_start ? new Date(u.subscription_start).toISOString() : null,
                  subscription_expiry: u.subscription_expiry ? new Date(u.subscription_expiry).toISOString() : null,
                  created_at: u.created_at ? new Date(u.created_at).toISOString() : null,
                  updated_at: u.updated_at ? new Date(u.updated_at).toISOString() : null,
                };
              });

            return <MembersTable users={memberUsers} />;
          })()}
        </div>
      </div>
    </div>
  );
}
