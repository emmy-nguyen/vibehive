import { create } from "zustand";
import { SongStore } from "../../../types";
import { deleteSong } from "../_action/delete-action";

export const useSongStore = create<SongStore>((set) => ({
  songs: [],
  setSongs: (songs) => set({ songs }),
  deleteSongs: async (id) => {
    await deleteSong(id);
    set((state) => ({
      songs: state.songs.filter((song) => song.id !== id),
    }));
  },
}));
