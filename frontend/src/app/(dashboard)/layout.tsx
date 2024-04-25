import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import DTIGPTLayout from "@/components/DTIGPTLayout";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DTI GPT",
  description: "",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <DTIGPTLayout>{children}</DTIGPTLayout>
        </body>
      </html>
    </SessionWrapper>
  );
}
