import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DTIGPTLayout from "@/components/DTIGPTLayout";

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
    <html lang="en">
      <body className={inter.className}>
        <DTIGPTLayout>{children}</DTIGPTLayout>
      </body>
    </html>
  );
}
