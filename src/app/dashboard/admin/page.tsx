import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin - Membership",
  description: "Admin dashboard (new)",
};

export default function DashboardAdminPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard (New)
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This is the new dashboard at /dashboard/admin.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard Coming Soon
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Replace this with your dashboard components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
