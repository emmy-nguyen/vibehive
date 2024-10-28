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
  songData: SongData | null;
  setSongData: (data: SongData) => void;
  clearSongData: () => void;
}

export interface SongData {
  id: number;
  title: string;
  artist: string;
  songUrl: string;
  imageUrl: string | null;
}

export interface EditSongContextType {
  songData: SongData | null;
  setSongData: (data: SongData | null) => void;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}
