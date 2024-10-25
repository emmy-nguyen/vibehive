"use client";

import Image from "next/image";
import { Song } from "../../../../types";

interface SongItemProps {
  data: Song;
  onClick: (id: number) => void;
}
const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  return (
    <div
      onClick={() => onClick(data.id)}
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover"
          src={data.imagePath || "/images/default.jpeg"}
          fill
          alt="Song Image"
        />
      </div>
      <div className="flex flex-col items-start w-full p-4 gap-y-1">
        <p className="font-semibold truncate w-full">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {data.artist}
        </p>
      </div>
    </div>
  );
};

export default SongItem;
