"use client";
import TableHeader from "@/app/components/TableHeader";
import React from "react";
import { Song } from "../../../../types";
import SongList from "@/app/components/SongList";
import useEditProfileModal from "@/app/hooks/useEditProfileModal";
import useAuthModal from "@/app/hooks/useAuthModal";

export default function Profile({
  user,
  songs,
}: {
  user: {
    username?: string | null;
  };
  songs: Song[];
}) {
  const editProfileModal = useEditProfileModal();
  const authModal = useAuthModal();

  const handleOpenModal = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return editProfileModal.onOpen();
  };
  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      {/* Header */}
      <header className="flex items-end justify-between p-6 h-80 bg-gradient-to-b from-neutral-500 to-black shadow-md rounded-lg">
        <div className="flex items-center">
          <img
            src="/images/defaultAvatar.jpeg"
            alt="User Avatar"
            className="w-36 h-36 rounded-full"
          />
          <div className="ml-6">
            <h1 className="text-6xl font-semibold">{user.username}</h1>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-white hover:bg-yellow-500 hover:text-white text-neutral-900 py-2 px-4 rounded-lg font-semibold"
        >
          Edit Profile
        </button>
      </header>

      <TableHeader />
      {songs && songs.length > 0 ? (
        <SongList initialSongs={songs} />
      ) : (
        <div className="mx-8 text-neutral-400">No song available</div>
      )}
    </div>
  );
}
