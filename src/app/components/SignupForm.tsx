"use client";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { FormEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import ToastMessage from "./toastMessage/toastmessage";
import useAuthModal from "../hooks/useAuthModal";

const SignupForm = () => {
  {
    /* set State for error toast */
  }
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastOpen, setToastOpen] = useState(false);

  const authModal = useAuthModal();
  {
    /* create a variable to validate input */
  }
  const userSchema = z.object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters long")
      .max(15, "Username must be 15 characters long")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Username can only contain alphanumeric characters"
      ),
    email: z.string().email("Please enter your valid email address"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .max(15, "Password must be at least 15 characters long")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Password can only contain alphanumeric characters"
      ),
  });

  {
    /* handleSignup */
  }
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const validatedData = userSchema.safeParse(data);

    {
      /* Front-end input validation */
    }
    if (!validatedData.success) {
      const error = validatedData.error.errors[0].code;
      if (error === "invalid_string") {
        setToastMessage(
          "Your input is invalid. Username & password must be alphanumeric character and email should be email@example.com"
        );
      } else if (error === "too_small" || error === "too_big") {
        setToastMessage(
          "Your username or password should be between 5 and 15 and alphanumeric characters"
        );
      }
      setToastOpen(true);
      return;
    }

    {
      /* handle backend result */
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: validatedData.data.username,
          email: validatedData.data.email,
          password: validatedData.data.password,
        }),
      });
      // FIXME: need redirection here
      const result = await response.json();
      if (result.message === "success") {
        setToastMessage("Signup successful");
        setToastOpen(true);
        authModal.onClose();
      } else if (result.message === "Username is already taken") {
        setToastMessage("Username is already taken");
        setToastOpen(true);
      } else if (result.message === "Email is already taken") {
        setToastMessage("Email is already taken");
        setToastOpen(true);
      } else {
        setToastMessage("Something is wrong");
        setToastOpen(true);
      }
    } catch (error) {
      console.log("Error signing up", error);
      setToastMessage("Error during signup process");
      setToastOpen(true);
    } finally {
      setToastOpen(false);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <Form.Root
        onSubmit={handleSignup}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg"
      >
        {/* username */}
        <Form.Field className="mb-6" name="username">
          <div className="mb-2">
            <Form.Label className="block text-white">Username</Form.Label>
            <Form.Message className="text-red-400 text-sm" match="valueMissing">
              Please enter your username
            </Form.Message>
            <Form.Message
              className="text-red-400 text-sm"
              match="patternMismatch"
            >
              Username must be between 5 to 15 characters and alphanumeric
              characters
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="username"
              required
              className="w-full p-3 rounded-md border border-gray-300 forcus-outline-none forcus:ring-2 focus:ring-[#c7d387]"
              placeholder="Enter your username"
            ></input>
          </Form.Control>
        </Form.Field>

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
              className="w-full p-3 rounded-md border border-gray-300 forcus-outline-none forcus:ring-2 focus:ring-[#c7d387]"
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
            <Form.Message
              match="patternMismatch"
              className="text-red-400 text-sm"
            >
              Password must be between 5 and 20 and alphanumeric characters
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="password"
              required
              className="w-full p-3 rounded-md border border-gray-300 focus-outline-none focus:ring-2 focus:ring-[#c7d387]"
              placeholder="Enter your password"
            ></input>
          </Form.Control>
        </Form.Field>

        {/* submit button */}
        <Form.Submit asChild>
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-md hover:bg-yellow-300 transition"
          >
            Sign up
          </button>
        </Form.Submit>
      </Form.Root>

      {/* Error Toast */}
      {isToastOpen && (
        <ToastMessage
          title={toastMessage || "Something wrong in singing up..."}
          isOpen={isToastOpen}
          onOpenChange={setToastOpen}
        />
      )}
    </div>
  );
};

export default SignupForm;
