import { create } from "zustand";
import { SongStore } from "../../../types";
import { deleteSong } from "../_action/delete-action";

export const useSongStore = create<SongStore>((set) => ({
  songData: null,
  setSongData: (data) => set({ songData: data }),
  clearSongData: () => set({ songData: null }),
}));
