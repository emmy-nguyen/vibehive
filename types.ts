export interface Song {
  id: number;
  title: string;
  artist: string;
  createdAt: Date;
  songPath: string;
  imagePath: string | null;
  userId: number;
}

export interface SongStore {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  deleteSongs: (id: number) => Promise<void>;
}

export interface SongData {
  id: number;
  title: string;
  artist: string;
  songUrl: string;
  imageUrl: string;
}

export interface EditSongContextType {
  songData: SongData | null;
  setSongData: (data: SongData | null) => void;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}
