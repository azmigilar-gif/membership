import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Membership Dunzz",
  description: "Admin dashboard for managing members",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the admin dashboard. Manage members and memberships here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Members
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            0
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Members
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            0
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pending
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            0
          </p>
        </div>
      </div>

      {/* Empty Content */}
      <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No data yet. Start by registering a new member from the sidebar.
        </p>
      </div>
    </div>
  );
}
