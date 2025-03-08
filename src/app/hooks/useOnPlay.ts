import { useSession } from "next-auth/react";
import { Song } from "../../../types";
import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const user = useSession();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => String(song.id)));
    //     if (player.activeId === id) {
    //       if (player.isPlaying) {
    //         player.pause();
    //       } else {
    //         player.play();
    //       }
    //     } else {
    //       player.setId(id);
    //     }
  };
  return onPlay;
};
export default useOnPlay;
