"use client";

import Image from "next/image";
import { Song } from "../../../types";

interface MediaItemProps {
  data: Song;
  onClick?: (id: number) => void;
}
const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  //   const imageUrl = useLoadImage(data);
  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
    // TODO: Default turn on player
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] max-h-[48px] w-[48px] h-[48px] overflow-hidden">
        <Image
          fill // have to use "w-[48px] h-[48px]"" in div to use "fill"
          src={data.imagePath ? data.imagePath : "/images/default.jpeg"}
          alt="Media Item"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.artist}</p>
      </div>
    </div>
  );
};

export default MediaItem;
