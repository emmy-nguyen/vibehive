import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ModalProvider from "./providers/ModalProvider";
import { getServerSession } from "next-auth";
import ClientSessionProvider from "./providers/ClientSessionProvider";
import { getSongsByUser } from "@/app/_action/get-songs-by-user-action";
import Player from "./components/player/Player";
import ToasterProvider from "./providers/ToasterProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeHive",
  description: "MiFaSol",
  icons: {
    icon: "/favicon.png",
  },
};

export const revalidate = 0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const userSongs = (await getSongsByUser()) || [];
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientSessionProvider session={session}>
          <ToasterProvider />
          <ModalProvider />
          <Sidebar songs={userSongs}>{children}</Sidebar>
          <Player />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
