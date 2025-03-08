import { useEffect, useMemo, useState } from "react";
import { Song } from "../../../types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    const fetchSong = async () => {
      try {
        const response = await fetch(`/api/getSongById?id=${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(`HTTP error! status: ${response.status}`);
          // return toast.error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        setSong(data[0] as Song);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occured");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchSong();
  }, [id]);
  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};

export default useGetSongById;
