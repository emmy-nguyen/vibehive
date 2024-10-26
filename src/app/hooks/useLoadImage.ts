import { create } from "zustand";
interface ImageStore {}

const useLoadImage = create<ImageStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  isLoading: false,
  audio: null,
  setId: async (id: string) => {
    set({ isLoading: true });

    // fetch data from api getSongUrl
    try {
      const response = await fetch(`/api/getImageUrl?id=${id}`);
      if (response.ok) {
        const data = await response.json();
      }
    } catch (err) {
    } finally {
    }
  },
}));
