"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../Button";
import useEditModal from "@/app/hooks/useEditModal";
import { useSongStore } from "@/app/hooks/useSongStore";
import Image from "next/image";
import { editSong } from "@/app/_action/edit-action";
import { getSignedURL } from "@/app/_action/upload-action";
import computeSHA256 from "@/app/_helper/computeSHA256";

const EditSongModal = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { songData } = useSongStore();

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(songData?.imageUrl || "");
  const [songPreview, setSongPreview] = useState(songData?.songUrl || "");
  const [songTitle, setSongTitle] = useState(songData?.title || "");
  const [songArtist, setArtist] = useState(songData?.artist || "");
  const editModal = useEditModal();

  const { register, handleSubmit, reset, setValue } = useForm<FieldValues>({
    defaultValues: {
      songId: songData?.id || "",
      title: songData?.title || "",
      artist: songData?.artist || "",
      song: null,
      image: null,
    },
  });

  useEffect(() => {
    reset({
      songId: songData?.id,
      title: songData?.title,
      artist: songData?.artist,
    });
    setSongPreview(songData?.songUrl || "");
    setImagePreview(songData?.imageUrl || "");
  }, [songData, reset]);

  const onChange = (open: boolean) => {
    if (!open) {
      // close form, reset form
      reset();
      editModal.onClose();
    }
  };

  // handle title, artist input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      const newTitle = e.target.value;
      setValue("title", newTitle);
    }

    if (name === "artist") {
      const newArtist = e.target.value;
      setValue("artist", newArtist);
    }
  };

  // handle image input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setValue("image", file);
    }
  };

  // handle song input changes
  const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const songUrl = URL.createObjectURL(file);
      setSongPreview(songUrl);
      setValue("song", file);
    }
  };

  // handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      const { songId, title, artist, song, image } = values;
      console.log(values);
      setIsLoading(true);

      if (!title || !artist) {
        console.log("Missing fields");
        // toast.error("Missing fields");
        return;
      }

      // URLs for new S3 upload files
      let newSongPath = songPreview;
      let newImagePath = imagePreview;
      let oldSongPath = "";
      let oldImagePath = "";

      const songCheckSum = await computeSHA256(song);
      const imageCheckSum = await computeSHA256(image);

      // if new song is added, get signed URL for the new song
      if (song instanceof File) {
        const songSignedURLResult = await getSignedURL({
          fileName: song.name,
          fileType: song.type,
          fileSize: song.size,
          checksum: songCheckSum,
        });

        if (songSignedURLResult.failure !== undefined) {
          console.error("Error to get signed URL for song and image");
          return;
        }
        const songSignedUrl = songSignedURLResult.success.url;
        console.log("Line 155 songSignedURL: " + songSignedUrl);

        const songUploadResponse = await fetch(songSignedUrl, {
          method: "PUT",
          body: song,
          headers: {
            "Content-Type": song.type,
          },
        });
        newSongPath = songSignedUrl.split("?")[0];
        console.log("Line 165: " + newSongPath);

        // delete the old song file in S3 bucket
        if (songData?.songUrl) {
          oldSongPath = songData?.songUrl;
        }
      }
      console.log("Line 176: try to delete the old song");

      // if new image is added, get signed URL for the new image
      if (image instanceof File) {
        const imageSignedURLResult = await getSignedURL({
          fileName: image.name,
          fileType: image.type,
          fileSize: image.size,
          checksum: imageCheckSum,
        });
        if (imageSignedURLResult.failure !== undefined) {
          console.error("Error to get signed URL for song and image");
          return;
        }
        const imageSignedUrl = imageSignedURLResult.success.url;
        console.log("Line 192: ", imageSignedUrl);

        const imageUploadResponse = await fetch(imageSignedUrl, {
          method: "PUT",
          body: image,
          headers: {
            "Content-Type": image.type,
          },
        });
        newImagePath = imageSignedUrl.split("?")[0];
        console.log("Line 203: ", newImagePath);

        // delete the old image file in S3 bucket
        if (songData?.imageUrl) {
          oldImagePath = songData?.imageUrl;
        }
      }
      console.log("Line 215: try to delete the old img");

      // call editSong from action
      await editSong(
        songId,
        title,
        artist,
        oldImagePath,
        oldSongPath,
        newSongPath,
        newImagePath
      );
      console.log("Line 219: update song");

      setIsLoading(false);
      editModal.onClose();
    } catch (err) {
      console.error("Error editing song:", err);
    } finally {
      setIsLoading(false);
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <Input type="hidden" {...register("songId")} />
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: "Title is required" })}
            placeholder="Edit a song title here"
            defaultValue={songTitle}
            onChange={handleInputChange}
          />
          <Input
            id="artist"
            disabled={isLoading}
            {...register("artist", { required: "Artist name is required" })}
            placeholder="Edit an artist name here"
            defaultValue={songArtist}
            onChange={handleInputChange}
          />
          <div>
            <div className="pb-1">Select a song file</div>
            {/* song preview */}
            {songPreview && (
              <audio controls className="w-full mb-2">
                <source src={songPreview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            <Input
              id="song"
              type="file"
              disabled={isLoading}
              accept=".mp3"
              onChange={handleSongChange}
            />
          </div>
          <div>
            <div className="pb-1">Select an image</div>
            {/* image preview */}
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Song Image"
                className="w-[60px] h-[60px] mb-2"
                width={60}
                height={60}
              />
            )}
            <Input
              id="image"
              type="file"
              disabled={isLoading}
              accept="image/*"
              onChange={handleImageChange}
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
