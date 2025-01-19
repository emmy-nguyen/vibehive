"use client";

import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import useAuthModal from "../hooks/useAuthModal";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { and, db, eq } from "@/db/index";
import { liked } from "@/db/schema/liked";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

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
          `/api/like?songId=${encodeURIComponent(
            songId
          )}&userId=${encodeURIComponent(userId)}`
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

  const handleLike = async () => {
    if (!userId) return authModal.onOpen();

    try {
      const response = await fetch(`/api/like`, {
        method: isLiked ? "DELETE" : "POST",
        body: JSON.stringify({ songId, userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        router.refresh();
      } else {
        toast.error("Error updating like status");
      }
    } catch (error) {
      toast.error("Error updating like status");
    }
  };
  return (
    <button onClick={handleLike} className="hover: opacity-75 transition">
      <Icon color={isLiked ? "#EAB308" : "white"} size={25} />{" "}
    </button>
  );
};

export default LikeButton;
