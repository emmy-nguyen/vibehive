"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";
import AuthModal from "../components/AuthModal";
import UploadModal from "../components/upload/UploadModal";
import EditSongModal from "../components/edit/EditSongModal";

interface ModalProviderProps {
  songId: string;
}

const ModalProvider = () => {
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
      <EditSongModal />
    </>
  );
};

export default ModalProvider;
