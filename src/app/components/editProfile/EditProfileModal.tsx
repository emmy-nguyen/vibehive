"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import useEditProfileModal from "@/app/hooks/useEditProfileModal";
import { editProfile } from "@/app/_action/edit-profile-action";

const EditProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editProfileModal = useEditProfileModal();

  const { register, handleSubmit, reset, setValue } = useForm<FieldValues>({
    defaultValues: {
      id: "",
      username: "",
    },
  });
  // useEffect(() => {
  //   const { data: session } = useSession();
  //   const user = session?.user;
  //   setValue("id", user?.id);
  // });
  const onChange = (open: boolean) => {
    if (!open) {
      // close form, reset form
      reset();
      editProfileModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const newUsername = values.username;
    console.log(newUsername);
    // try {
    //   const response = await editProfile(newUsername);
    //   if (response.failure) {
    //     console.log(response.message);
    //     toast.error(response.message || "Error updating username");
    //   }
    //   console.log(response.message);
    //   toast.success("Profile updated successfully");
    // } catch (err) {
    //   console.error("Error updating profile", err);
    //   toast.error("Error updating profile");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <div>
      <Modal
        title="Edit Profile"
        description="What would you like to update your username to? 😈"
        isOpen={editProfileModal.isOpen}
        onChange={onChange}
      >
        <form
          // onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          {/* <Input type="hidden" {...register("id")} /> */}

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
