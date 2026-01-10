"use client";
import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { GridIcon, UserCircleIcon, ChevronDownIcon } from "@/icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin-new",
  },
  {
    icon: <UserCircleIcon />,
    name: "Register Member",
    path: "/admin-new/register-member",
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden bg-white dark:bg-gray-900 lg:static lg:translate-x-0 transition-transform duration-300 ${
        isMobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
      } lg:w-64 ${isExpanded ? "lg:w-64" : "lg:w-20"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-800 lg:py-5 lg:px-4">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
        {(isExpanded || isHovered || isMobileOpen) && (
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Membership
          </h3>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-4">
          {adminNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 ${
                    isActive(item.path)
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info Section */}
      <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
              A
            </span>
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Admin
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
