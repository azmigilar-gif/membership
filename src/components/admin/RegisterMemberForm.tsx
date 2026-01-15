"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";

type FormData = {
  name: string;
  email: string;
  password: string;
  benefit: string;
};

const benefits = [
  { value: "platinum", label: "Platinum Benefit" },
  { value: "diamond", label: "Diamond Benefit" },
  { value: "ultimate", label: "Ultimate Gold" },
];

export default function RegisterMemberForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    benefit: "platinum",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/members/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register member");
        return;
      }

      setSuccess("Member registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        benefit: "silver",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter member's full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter member's email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password">Password</Label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Benefit Select */}
        <div>
          <Label htmlFor="benefit">Membership Benefit</Label>
          <select
            id="benefit"
            name="benefit"
            value={formData.benefit}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {benefits.map((benefit) => (
              <option key={benefit.value} value={benefit.value}>
                {benefit.label}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register Member"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
