"use client";

import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import useAuthModal from "../hooks/useAuthModal";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { and, db, eq } from "@/db/index";
import { liked } from "@/db/schema/liked";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}
const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const userId = session?.user?.id;

  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/like?songId=${songId}&userId=${session?.user?.id}`
        );
        const data = await response.json();
        setIsLiked(data.liked);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [userId, songId]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = () => {
    if (!userId) return authModal.onOpen();

    if (isLiked) {
    }
  };
  return (
    <button onClick={handleLike} className="hover: opacity-75 transition">
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />{" "}
    </button>
  );
};

export default LikeButton;
