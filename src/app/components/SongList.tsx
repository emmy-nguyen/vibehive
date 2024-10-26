"use client";

import { useEffect, useState } from "react";
import { Song } from "../../../types";
import { deleteSong } from "../_action/delete-action";
import SongItemInProfile from "./SongItemInProfile";

export default function SongList({ initialSongs }: { initialSongs: Song[] }) {
  const [allSongs, setAllSongs] = useState<Song[]>(initialSongs);

  useEffect(() => {
    setAllSongs(initialSongs);
  }, [initialSongs]);

  const handleDeleteSong = async (songId: number) => {
    try {
      await deleteSong(songId);
      setAllSongs((prevSongs) =>
        prevSongs.filter((song) => song.id !== songId)
      );
    } catch (err) {
      console.error("Failed to delete song", err);
      // TO DO: show toast here
    }
  };

  return (
    <div>
      {allSongs.map((song) => (
        <SongItemInProfile
          key={song.id}
          {...song}
          onDelete={handleDeleteSong}
        />
      ))}
    </div>
  );
}
