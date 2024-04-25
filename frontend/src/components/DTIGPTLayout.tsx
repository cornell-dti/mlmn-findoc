"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pages from "@/utils/pages";
import { useSession, signOut } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dummyHistory : string[] = [];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-black">
      <aside
        className={`transform top-0 left-0 w-64 bg-[#000000] min-h-screen fixed transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/4 right-0 -mr-6 transform -translate-y-1/2 bg-blue-900 rounded-full p-1 focus:outline-none ${
            !sidebarOpen && "rotate-180"
          }`}
        >
          <img src="/icons/blue-arrow.png" alt="Toggle Sidebar" className="w-6 h-6 text-blue-500" />
        </button>
        <div className="flex items-center p-4 border-b border-gray-800 pt-24">
          <img src={session?.user?.image!} alt="User profile" className="rounded-full h-12 w-12 mr-4" />
          <div>
            <p className="text-gray-400 text-sm">Welcome 👋</p>
            <p className="text-white text-md font-bold">{session?.user?.name}</p>
          </div>
        </div>
        <nav className="flex flex-col p-4">
          <div className={"text-white"}>File History</div>
          {dummyHistory.map((history) => "")}
          <div className={"text-white"}>Function</div>
          {pages.map((page) => (
            <div key={page.index} className="mt-2 flex items-center relative">
              {pathname === page.route && (
                <span className="absolute left-0 ml-[-1.5rem]">
                  <img src="/icons/green-pointer.png" alt="Active Icon" className="w-6 h-6" />
                </span>
              )}
              <Link
                href={page.route}
                className={`block text-gray-300 hover:bg-blue-700 p-2 w-full rounded flex items-center ${
                  pathname === page.route ? "text-white" : "text-gray-500"
                }`}
              >
                <img src={page.icon} alt={page.name} className="w-6 h-6 mr-2" />
                {page.name}
              </Link>
            </div>
          ))}
        </nav>
        <button onClick={() => signOut()} className="bottom-0 left-0 w-full border-solid p-4 text-white text-center">
          Log Out
        </button>
        <div className="flex items-stretch justify-center align-bottom absolute bottom-6 left-0">
          <img src="/logos/mlmn_logo.jpeg" alt="Mlmn Logo" className="flex-none p-4 w-1/3 " />
          <img src="/logos/dti_logo.png" alt="DTI Logo" className="flex-none p-4 w-1/3 " />
        </div>
        <p className = "text-center justify-center font-bold text-white align-bottom absolute bottom-2 left-0 right-0 mx-auto"> Millennium x Cornell DTI</p>
      </aside>
      <div className={`flex-1  transition-margin duration-200 ease-in-out bg-mainContent ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <main className="min-h-screen" style={{ backgroundColor: "#231f1e" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
