"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <div className="min-h-screen bg-mainContent">
        <div className="w-full px-52 pt-52">
          <p className="text-left text-5xl  font-normal text-white">Welcome, {session?.user?.name}!</p>
          <p className="mb-2"> </p>
          <p className="text-left text-5xl  font-normal text-white">What can we help you with?</p>
        </div>

        <div className="flex justify-normal mt-20 space-x-12 w-full px-52">
          <Link href="/chat/summarize">
            <button className="w-80 h-32 rounded-lg shadow bg-buttonColor hover:bg-hoverColor">
              <span className="w-full h-full flex flex-col justify-center items-left text-white text-left text-lg font-medium px-12">
                Summarize
                <span className="text-sm">to extract important data</span>
              </span>
            </button>
          </Link>

          <Link href="/chat/parse">
          <button className="w-80 h-32 rounded-lg shadow bg-buttonColor hover:bg-hoverColor">
              <span className="w-full h-full flex flex-col justify-center items-left text-white text-left text-lg font-medium px-12">
                Parse
                <span className="text-sm">from syllabus</span>
              </span>
            </button>
          </Link>

          <Link href="/chat/compare">
            <button className="w-80 h-32 rounded-lg shadow bg-buttonColor hover:bg-hoverColor">
              <span className="w-full h-full flex flex-col justify-center items-left text-white text-left text-lg font-medium px-12">
                Compare
                <span className="text-sm">with another file</span>
              </span>
            </button>
          </Link>
        </div>
      </div>

    </>
  );
}
