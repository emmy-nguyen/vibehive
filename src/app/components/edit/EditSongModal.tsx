"use client";

import { FieldValues, useForm } from "react-hook-form";
import Input from "../Input";
import Modal from "../Modal";

const EditSongModal = () => {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      artist: "",
      song: null,
      image: null,
    },
  });
  return (
    <div>
      <Modal
        title="Edit a song"
        description="Change a song's information"
        isOpen
        onChange={() => {}}
      >
        <form onSubmit={() => {}} className="flex flex-col gap-y-4">
          <Input
            id="title"
            // disabled
            {...register("title", { required: "Title is required" })}
            placeholder="Edit a song title here"
          />
          <Input
            id="artist"
            // disabled
            {...register("artist", { required: "Artist name is required" })}
            placeholder="Edit an artist name here"
          />
        </form>
      </Modal>
    </div>
  );
};
