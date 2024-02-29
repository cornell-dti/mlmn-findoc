"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pages from "@/utils/pages";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-black">
      {" "}
      <aside
        className={`transform top-0 left-0 w-64 bg-[#000000] min-h-screen fixed transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 right-0 -mr-6 transform -translate-y-1/2 bg-blue-900 rounded-full p-1 focus:outline-none ${
            !sidebarOpen && "rotate-180"
          }`}
        >
          <img
            src="/icons/blue-arrow.png"
            alt="Toggle Sidebar"
            className="w-6 h-6 text-blue-500"
          />
        </button>
        <div className="flex items-center p-4 border-b border-gray-800 pt-24">
          <img
            src="/dummy/profile.png"
            alt="User profile"
            className="rounded-full h-12 w-12 mr-4"
          />
          <div>
            <p className="text-gray-400 text-sm">Welcome 👋</p>
            <p className="text-white text-lg font-bold">Stanley.</p>
          </div>
        </div>
        <nav className="flex flex-col p-4">
          {pages.map((page) => (
            <Link
              key={page.index}
              href={page.route}
              className={`text-gray-300 hover:bg-blue-700 p-2 rounded mt-2 flex items-center ${
                pathname === `/${page.route}`
                  ? "text-sidebarTextActive"
                  : "text-sidebarText"
              }`}
            >
              {pathname === `/${page.route}` && (
                <span className="absolute w-2 h-2 bg-green-500 rounded-full left-0 ml-1" />
              )}
              <img src={page.icon} alt={page.name} className="w-6 h-6 mr-2" />
              <span>{page.name}</span>
            </Link>
          ))}
        </nav>
        <img
          src="/logos/dti.png"
          alt="DTI Logo"
          className="w-max h-max mx-auto border-t border-gray-800 p-4 mt-auto"
        />
      </aside>
      <div
        className={`flex-1  transition-margin duration-200 ease-in-out bg-mainContent ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <main className="h-screen">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
