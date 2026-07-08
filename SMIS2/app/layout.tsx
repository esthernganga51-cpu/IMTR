import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/features/admin-dashboard/lib/utils";

export const metadata: Metadata = {
  title: "SMIS Admin Portal",
  description: "Student Management Information System admin portal",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  );
}