export interface Song {
  id: number;
  title: string;
  artist: string;
  createdAt: Date;
  songPath: string;
  imagePath: string | null;
  userId: number;
}
