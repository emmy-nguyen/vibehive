"use client";

import { FieldValues, useForm } from "react-hook-form";
import Input from "../Input";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { StringValidation } from "zod";
import { useSession } from "next-auth/react";
import Button from "../Button";
import useEditModal from "@/app/hooks/useEditModal";

interface EditSongModalProps {
  songData: {
    title: string;
    artist: string;
    songUrl: string;
    imageUrl: string;
  };
}

const EditSongModal = () => {
  const editModal = useEditModal();
  const { data: session } = useSession();
  const user = session?.user;

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      artist: "",
      song: null,
      image: null,
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      // close form, reset form
      reset();
      editModal.onClose();
    }
  };

  return (
    <div>
      <Modal
        title="Edit a song"
        description="Change a song's information"
        isOpen={editModal.isOpen}
        onChange={onChange}
      >
        <form onSubmit={() => {}} className="flex flex-col gap-y-4">
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: "Title is required" })}
            placeholder="Edit a song title here"
          />
          <Input
            id="artist"
            disabled={isLoading}
            {...register("artist", { required: "Artist name is required" })}
            placeholder="Edit an artist name here"
          />
          <div>
            <div className="pb-1">Select a song file</div>
            <Input
              id="song"
              type="file"
              disabled={isLoading}
              accept=".mp3"
              onChange={() => {}}
            />
          </div>
          <div>
            <div className="pb-1">Select an image</div>
            <Input
              id="image"
              type="file"
              disabled={isLoading}
              accept="image/*"
              onChange={() => {}}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Update Song
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default EditSongModal;
