import type { Metadata } from "next";
import RegisterMemberFormNew from "@/components/admin/RegisterMemberFormNew";

export const metadata: Metadata = {
  title: "Register Member | Admin New",
  description: "Register a new member (admin-new)",
};

export default function AdminNewRegisterMemberPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Register Member
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a new member account
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <RegisterMemberFormNew />
      </div>
    </div>
  );
}
