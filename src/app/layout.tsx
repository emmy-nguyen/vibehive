import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ModalProvider from "./providers/ModalProvider";
import { getServerSession } from "next-auth";
import ClientSessionProvider from "./providers/ClientSessionProvider";
import { getSongsByUser } from "../action/get-songs-by-user-action";
import Player from "./components/player/Player";

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
  const userSongs = (await getSongsByUser()) || [];
  console.log(userSongs);
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientSessionProvider session={session}>
          <ModalProvider />
          <Sidebar songs={userSongs}>{children}</Sidebar>
          <Player />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
