import type { Metadata } from "next";
import AdminHeader from "@/layout/AdminHeader";
import AdminSidebar from "@/layout/AdminSidebar";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Membership",
  description: "Admin dashboard for membership management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden hidden" />
    </div>
  );
}
