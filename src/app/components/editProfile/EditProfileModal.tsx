"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import useUploadModal from "../../hooks/useUploadModal";
import Input from "../Input";
import Button from "../Button";
import toast from "react-hot-toast";
// import ToastMessage from "../toastMessage/toastmessage";
import { getSignedURL, uploadFile } from "@/app/_action/upload-action";
import computeSHA256 from "@/app/_helper/computeSHA256";
import useEditProfileModal from "@/app/hooks/useEditProfileModal";

const EditProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editProfileModal = useEditProfileModal();

  const { register, handleSubmit, reset, setValue } = useForm<FieldValues>({
    defaultValues: {
      username: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // close form, reset form
      reset();
      editProfileModal.onClose();
    }
  };

  const onSubmit = () => {};
  return (
    <div>
      <Modal
        title="Edit Profile"
        description="What would you like to update your username to? 😈"
        isOpen={editProfileModal.isOpen}
        onChange={onChange}
      >
        <form onSubmit={() => {}} className="flex flex-col gap-y-4">
          <Input
            id="username"
            disabled={isLoading}
            {...register("username", { required: "Username is required" })}
            placeholder="Username"
          />
          <Button disabled={isLoading} type="submit">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default EditProfileModal;
