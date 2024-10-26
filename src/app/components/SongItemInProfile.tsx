import Image from "next/image";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteSong } from "../_action/delete-action";

interface SongItemInProfileProps {
  id: number;
  title: string;
  artist: string;
  imagePath: string | null;
  onDelete: (id: number) => void;
}
export default function SongItemInProfile({
  id,
  title,
  artist,
  imagePath,
  onDelete,
}: SongItemInProfileProps) {
  return (
    <div className="grid grid-cols-player mx-auto py-2 px-4 transition-colors hover:bg-hover cursor-pointer">
      <div className="col-span-1 flex items-center">
        <Image
          src={imagePath ? imagePath : "/images/default.jpeg"}
          alt="Song Image"
          className="w-[40px] h-[40px] ml-2"
          width={40}
          height={40}
        />
      </div>
      <div className="col-span-5 flex flex-col items-start justify-start">
        <span className="text-white font-semibold">{title}</span>
        {/* <span>{artist}</span> */}
      </div>
      <div className="col-span-5 flex items-center justify-start">{artist}</div>
      <div className="col-span-1 flex items-center justify-start">
        <div className="flex justify-center space-x-3">
          <div>
            <FiEdit2 size={20} className="text-neutral-500" />
          </div>
          <div onClick={() => onDelete(id)}>
            <FiTrash2 size={20} className="text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
