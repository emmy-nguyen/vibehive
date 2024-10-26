import { create } from "zustand";
interface PlayerStore {
  ids: string[];
  activeId?: string;
  activeUrl?: string;
  isPlaying: boolean;
  isLoading: boolean;
  audio: HTMLAudioElement | null;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  isLoading: false,
  audio: null,
  setId: async (id: string) => {
    set({ isLoading: true });

    // fetch data from api getSongUrl
    try {
      const response = await fetch(`/api/getSongUrl?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        const newAudio = new Audio(data.url);

        // stop current audio if it exist
        get().audio?.pause();

        newAudio.oncanplay = () => {
          newAudio.play().catch((err) => {
            console.error("Failed to play audio:", err);
            set({ isPlaying: false });
          });
        };

        newAudio.onerror = () => {
          console.error("Failed to load audio:", newAudio.error);
          set({ isPlaying: false });
        };

        set({
          activeId: id,
          activeUrl: data.url,
          isPlaying: true,
          isLoading: false,
          audio: newAudio,
        });
      } else {
        console.error("Failed to fetch song URL:", response.statusText);

        throw new Error("Failed to fetch song URL");
      }
    } catch (err) {
      console.error("Error in setId:", err);
      set({ isPlaying: false });

      //   console.error("Failed to setting song URL:", err);
    } finally {
      set({ isLoading: false });
    }
  },
  setIds: (ids: string[]) => set({ ids }),
  play: () => {
    const { audio } = get();
    if (audio) {
      audio.play().catch((err) => console.error("Failed to play audio:", err));
      set({ isPlaying: true });
    }
  },
  pause: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
    }
  },
  next: () => {
    const { ids, activeId } = get();
    const currentIndex = activeId ? ids.indexOf(activeId) : -1;
    if (currentIndex >= 0 && currentIndex < ids.length - 1) {
      get().setId(ids[currentIndex + 1]);
    }
  },
  previous: () => {
    const { ids, activeId } = get();
    const currentIndex = activeId ? ids.indexOf(activeId) : -1;
    if (currentIndex > 0) {
      get().setId(ids[currentIndex - 1]);
    }
  },
  reset: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    set({
      ids: [],
      activeId: undefined,
      activeUrl: undefined,
      isPlaying: false,
      audio: null,
    });
  },
}));

export default usePlayer;
