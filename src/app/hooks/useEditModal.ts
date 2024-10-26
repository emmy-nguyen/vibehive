import { create } from "zustand";

interface EditModalStore {
  isOpen: boolean;
  isLogin: boolean;
  onOpen: (isLogin?: boolean) => void;
  onClose: () => void;
}

const useEditModal = create<EditModalStore>((set) => ({
  isOpen: false,
  isLogin: true,
  onOpen: (isLogin = true) => set({ isOpen: true, isLogin }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditModal;
