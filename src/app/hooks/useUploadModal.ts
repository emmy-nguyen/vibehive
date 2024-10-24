import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  isLogin: boolean;
  onOpen: (isLogin?: boolean) => void;
  onClose: () => void;
}

const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  isLogin: true,
  onOpen: (isLogin = true) => set({ isOpen: true, isLogin }),
  onClose: () => set({ isOpen: false }),
}));

export default useUploadModal;
