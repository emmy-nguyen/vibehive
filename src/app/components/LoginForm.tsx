"use client";

import * as Form from "@radix-ui/react-form";
import { FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import useAuthModal from "../hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ToastMessage from "./toastMessage/toastmessage";
import toast from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();
  const authModal = useAuthModal();
  // const [isToastOpen, setToastOpen] = useState(false);
  // const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    // handle error response
    if (!response?.error) {
      // setToastMessage("Login successful");

      router.push("/");
      router.refresh();
      toast.success("Login successful");
      authModal.onClose();
      // setToastOpen(true);
    } else {
      // setToastMessage(`${response?.error}`);
      console.log(response?.error);
      // setToastOpen(true);
      toast.error(`${response?.error}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Form.Root
        onSubmit={handleLogin}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg"
      >
        {/* Email field */}
        <Form.Field className="mb-6" name="email">
          <div className="mb-2">
            <Form.Label className="block text-white">Email</Form.Label>
            <Form.Message className="text-red-400 text-sm" match="valueMissing">
              Please enter your email
            </Form.Message>
            <Form.Message className="text-red-400 text-sm" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              required
              className="w-full p-3 rounded-md border border-gray-300 forcus-outline-none forcus:ring-2 focus:ring-[#1DB954]"
              placeholder="Enter your email"
            ></input>
          </Form.Control>
        </Form.Field>

        {/* Password field */}
        <Form.Field name="password" className="mb-6">
          <div className="mb-2">
            <Form.Label className="block text-white">Password</Form.Label>
            <Form.Message match="valueMissing" className="text-red-400 text-sm">
              Please enter your password
            </Form.Message>
            <Form.Message match="typeMismatch" className="text-red-400 text-sm">
              Please provide a valid password
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="password"
              required
              className="w-full p-3 rounded-md border border-gray-300 focus-outline-non focus:ring-2 focus-ring-[#1DB954]"
              placeholder="Enter your password"
            ></input>
          </Form.Control>
        </Form.Field>

        {/* submit button */}
        <Form.Submit asChild>
          <button className="w-full bg-white text-black py-3 rounded-md hover:bg-yellow-300 transition">
            Sign in
          </button>
        </Form.Submit>
        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Don't have an account?{" "}
            <Link
              href="/apt/auth/signup"
              className="text-white underline hover:text-yellow-300"
              onClick={() => authModal.onOpen(false)}
            >
              Sign up
            </Link>
          </p>
        </div>
      </Form.Root>

      {/* Error Toast */}
      {/* {isToastOpen && (
        <ToastMessage
          title={toastMessage || "Something wrong when loging in..."}
          isOpen={isToastOpen}
          onOpenChange={setToastOpen}
        />
      )} */}
    </div>
  );
};

export default LoginForm;
