import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin - Membership",
  description: "Admin dashboard overview",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Dashboard Content - Empty for now */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard Coming Soon
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Dashboard analytics and statistics will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
