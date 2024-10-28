"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";
import AuthModal from "../components/AuthModal";
import UploadModal from "../components/upload/UploadModal";
import EditSongModal from "../components/edit/EditSongModal";

interface ModalProviderProps {
  songData: {
    title: string;
    artist: string;
    songUrl: string;
    imageUrl: string;
  };
}

const ModalProvider = ({ props }: { props: ModalProviderProps }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AuthModal />
      <UploadModal />
      <EditSongModal props={props} />
    </>
  );
};

export default ModalProvider;
