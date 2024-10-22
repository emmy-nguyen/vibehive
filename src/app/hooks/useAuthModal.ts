import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  isLogin: boolean;
  onOpen: (isLogin?: boolean) => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  isLogin: true,
  onOpen: (isLogin = true) => set({ isOpen: true, isLogin }),
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;
