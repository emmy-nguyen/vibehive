import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ModalProvider from "./providers/ModalProvider";
import { getServerSession } from "next-auth";
import ClientSessionProvider from "./providers/ClientSessionProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeHive",
  description: "MiFaSol",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientSessionProvider session={session}>
          <ModalProvider />
          <Sidebar>{children}</Sidebar>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
