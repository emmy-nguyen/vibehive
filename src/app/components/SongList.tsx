"use client";

import { useEffect, useState } from "react";
import { Song } from "../../../types";
import { deleteSong } from "../_action/delete-action";
import SongItemInProfile from "./SongItemInProfile";
import { useSongStore } from "../hooks/useSongStore";
import ToastMessage from "./toastMessage/toastmessage";
import toast from "react-hot-toast";

export default function SongList({ initialSongs }: { initialSongs: Song[] }) {
  // const [allSongs, setAllSongs] = useState<Song[]>(initialSongs);
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs, setSongs]);

  const handleDeleteSong = async (songId: number) => {
    try {
      await deleteSong(songId);
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      toast.success("Song deleted successfully!");
    } catch (err) {
      console.error("Failed to delete song", err);
      toast.error("Failed to delete song. Please try again later.");
    } finally {
      // something here
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
    </div>
  );
}
