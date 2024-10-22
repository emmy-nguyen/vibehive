"use client";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Modal from "./Modal";
import useAuthModal from "../hooks/useAuthModal";
import { useState } from "react";

const AuthModal = () => {
  const { onClose, isOpen, isLogin } = useAuthModal();
  // const { isLogin, setIsLogin } = useState();
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title={isLogin ? "Welcome back! 🍯" : "🐝 Welcome to VibeHive!"}
      description={
        isLogin ? "Log in to your account" : "Sign up to start listening music"
      }
      isOpen={isOpen}
      onChange={onChange}
    >
      {isLogin ? <LoginForm /> : <SignupForm />}
    </Modal>
  );
};

export default AuthModal;
