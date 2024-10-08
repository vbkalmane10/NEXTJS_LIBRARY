"use client";
import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface NavItem {
  href: string;

  text: string;
}

interface SideNavProps {
  navItems: NavItem[];
  userName: string | undefined;
  membershipStatus?: string | undefined;
  locale:string;
}

const SideNav: React.FC<SideNavProps> = ({
  navItems,
  userName,
  membershipStatus,
  locale
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const membershipColor =
    membershipStatus === "active" ? "bg-green-500" : "bg-red-500";
  const membershipLabel = membershipStatus === "active" ? "Active" : "Expired";
  return (
    <>
      <button
        className=" fixed top-4 left-4 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0 md:static`}
      >
        <nav className="flex flex-col w-64 bg-white shadow-lg h-full">
          <div className="flex flex-col items-center mt-8 justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{userName}</h2>
            {membershipStatus && (
              <div
                className={` mt-2 px-3 py-1 text-sm font-semibold text-white rounded-full ${membershipColor}`}
              >
                {membershipLabel}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow px-4 mt-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
                    {item.text}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideNav;
