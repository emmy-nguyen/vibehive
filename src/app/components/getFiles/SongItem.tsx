"use client";

import Image from "next/image";
import { Song } from "../../../../types";
import usePlayer from "@/app/hooks/usePlayer";
import { FaPause, FaPlay } from "react-icons/fa";

interface SongItemProps {
  data: Song;
  onClick: (id: number) => void;
}
const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  // const player = usePlayer();

  // const handlePlay = async (event: React.MouseEvent) => {
  //   // prevent triggering onClick of the parent div
  //   event.stopPropagation();

  //   if (player.activeId === String(data.id)) {
  //     if (player.isPlaying) {
  //       player.pause();
  //     } else {
  //       player.play();
  //     }
  //   } else {
  //     await player.setId(String(data.id));
  //   }
  // };
  // const isThisSongPlaying =
  //   player.activeId === String(data.id) && player.isPlaying;
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          By {data.artist}
        </p>
      </div>
      <div className="absolute bottom-24 right-5">
        <button
          // onClick={handlePlay}
          // disabled={player.isLoading}
          className="transition opacity-0 rounded-full flex items-center bg-yellow-500 p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110"
        >
          {/* {player.isLoading && player.activeId === String(data.id) ? (
            "Loading"
          ) : isThisSongPlaying ? (
            <FaPause className="text-gray-950" />
          ) : ( */}
          <FaPlay className="text-gray-950" />
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export default SongItem;
