import { useSession } from "next-auth/react";
import Image from "next/image";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import useAuthModal from "../hooks/useAuthModal";
// import { useEditSong } from "../context/EditSongContext";
import useEditModal from "../hooks/useEditModal";
// import useEditModal, { useEditSong } from "../context/EditSongContext";

interface SongItemInProfileProps {
  id: number;
  title: string;
  artist: string;
  imagePath: string | null;
  // songUrl: string;
  onDelete: (id: number) => void;
}
export default function SongItemInProfile({
  id,
  title,
  artist,
  imagePath,
  // songUrl,
  onDelete,
}: SongItemInProfileProps) {
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const editModal = useEditModal();

  const handleOpenModal = () => {
    if (!session) {
      return authModal.onOpen();
    }
    return editModal.onOpen();
  };
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
            <FiEdit2
              onClick={handleOpenModal}
              size={20}
              className="text-neutral-500"
            />
          </div>
          <div>
            <FiTrash2
              onClick={() => onDelete(id)}
              size={20}
              className="text-neutral-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
