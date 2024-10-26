"use client";

import { useEffect, useState } from "react";
import { Song } from "../../../types";
import { deleteSong } from "../_action/delete-action";
import SongItemInProfile from "./SongItemInProfile";
import { useSongStore } from "../hooks/useSongStore";
import ToastMessage from "./toastMessage/toastmessage";

export default function SongList({ initialSongs }: { initialSongs: Song[] }) {
  //   const [allSongs, setAllSongs] = useState<Song[]>(initialSongs);
  const { songs, setSongs, deleteSongs } = useSongStore();
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs, setSongs]);

  const handleDeleteSong = async (songId: number) => {
    try {
      await deleteSong(songId);
      setSongs(songs.filter((song) => song.id !== songId));
      setToastOpen(true);
      setToastMessage("Song deleted successfully!");
    } catch (err) {
      console.error("Failed to delete song", err);
      setToastOpen(true);
      setToastMessage("Failed to delete song. Please try again later.");
    } finally {
      setToastOpen(false);
      setTimeout(() => setToastOpen(false), 3000);
    }
  };

  return (
    <div>
      {songs.map((song) => (
        <SongItemInProfile
          key={song.id}
          {...song}
          onDelete={handleDeleteSong}
        />
      ))}

      {isToastOpen && (
        <ToastMessage
          title={toastMessage || "Something wrong when deleting..."}
          isOpen={isToastOpen}
          onOpenChange={setToastOpen}
        />
      )}
    </div>
  );
}
