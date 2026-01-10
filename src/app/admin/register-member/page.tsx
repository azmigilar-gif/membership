import type { Metadata } from "next";
import RegisterMemberForm from "@/components/admin/RegisterMemberForm";

export const metadata: Metadata = {
  title: "Register Member | Admin - Membership",
  description: "Register a new member",
};

export default function RegisterMemberPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Register Member
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new member to the system
        </p>
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="p-6 sm:p-8">
          <RegisterMemberForm />
        </div>
      </div>
    </div>
  );
}
