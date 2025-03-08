import { useEffect, useState } from "react";
import { Song } from "../../../types";
import toast from "react-hot-toast";

const useLoadSongUrl = (song: Song) => {
  const [songUrl, setSongUrl] = useState("");
  const songData = Array.isArray(song) ? song[0] : song;

  useEffect(() => {
    if (!songData?.id) {
      return;
    }

    const fetchSongUrl = async () => {
      try {
        const response = await fetch(`/api/getSongUrl?id=${songData.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Song URL from API", data.url);
        if (!data.url) {
          throw new Error("Song URL not found");
        }
        setSongUrl(data.url);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An unknow error occured"
        );
      }
    };
    fetchSongUrl();
  }, [songData?.id]);
  return songUrl;
};

export default useLoadSongUrl;
