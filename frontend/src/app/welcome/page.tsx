"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';



export default function Home() {
  const { data: session } = useSession();
  return (
    <>
     <div className="min-h-screen bg-mainContent">
    
      <div className="w-full px-52 pt-52">
          <p className="text-left text-5xl  font-medium text-white">Welcome, {session?.user?.name}!</p>
          <p className="text-left text-5xl  font-medium text-white">What can we help you with?</p>
      </div>

      <div className="flex justify-center mt-8 space-x-12 w-full px-52">

      <Link href="/chat/summarize">
        <div className="px-8 relative w-80 h-32 rounded-md shadow hover:bg-white" style={{ backgroundColor: "#0D509D" }}>
          <span className="w-full h-full flex justify-center items-center text-white text-lg font-medium">Summarize</span>
        </div>
      </Link>

      <Link href="/chat/parse">
          <div className=" px-8 relative w-80 h-32 rounded-md shadow" style={{ backgroundColor: "#0D509D" }}>
            <span className="w-full h-full flex justify-center items-center text-white text-lg font-medium">Parse</span>
           </div>
       </Link>

       <Link href="/chat/compare">
          <div className=" px-8 relative  w-80 h-32 rounded-md shadow"style={{ backgroundColor: "#0D509D" }}>
            <span className="w-full h-full flex justify-center items-center text-white text-lg font-medium">Compare with another file</span>
          </div>
        </Link>

      </div>
      </div>

    </>
  );
}


