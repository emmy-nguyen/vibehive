import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeHive",
  description: "DoReMiFaSol: Where Every Note Tells a Story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={figtree.className}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
