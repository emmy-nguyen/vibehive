import { create } from "zustand";

interface EditProfileModalStore {
  isOpen: boolean;
  isLogin: boolean;
  onOpen: (isLogin?: boolean) => void;
  onClose: () => void;
}

const useEditProfileModal = create<EditProfileModalStore>((set) => ({
  isOpen: false,
  isLogin: true,
  onOpen: (isLogin = true) => set({ isOpen: true, isLogin }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditProfileModal;
