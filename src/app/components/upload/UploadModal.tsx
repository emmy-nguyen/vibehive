"use client";
import ModalProvider from "@/app/providers/ModalProvider";
import Modal from "../Modal";
import useUploadModal from "../../hooks/useUploadModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedURL } from "./action";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const uploadModal = useUploadModal();
  const { data: session } = useSession();
  const user = session?.user;
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      artist: "",
      song: null,
      image: null,
    },
  });

  // handle local input location to prepare to store files
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  };

  // handle onChange on Modal
  const onChange = (open: boolean) => {
    if (!open) {
      // close form, reset form
      reset();
      uploadModal.onClose();
    }
  };

  // function for checksum
  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // upload song&image functionality
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // submit form, handle form data
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const checksumImageFile = await computeSHA256(imageFile);
      const checksumSongFile = await computeSHA256(songFile);

      // get signedURL for the song file
      const songSignedURLResult = await getSignedURL({
        fileName: songFile.name,
        fileType: songFile.type,
        fileSize: songFile.size,
        checksum: checksumSongFile,
      });

      if (songSignedURLResult.failure !== undefined) {
        toast.error("Failed to sign URL for song");
        // setToastMessage("Failed to sign URL");
        // setIsToastOpen(true);
        console.error("error");
        return;
      }

      // get signedURL for the image file
      const imageSignedURLResult = await getSignedURL({
        fileName: imageFile.name,
        fileType: imageFile.type,
        fileSize: imageFile.size,
        checksum: checksumImageFile,
      });

      if (imageSignedURLResult.failure !== undefined) {
        toast.error("Failed to sign URL for image");
        // setToastMessage("Failed to sign URL");
        // setIsToastOpen(true);
        console.error("error");
        return;
      }

      const songUrl = songSignedURLResult.success.url;
      const imageUrl = imageSignedURLResult.success.url;

      // upload songs to S3
      const songUploadResponse = await fetch(songUrl, {
        method: "PUT",
        body: songFile,
        headers: {
          "Content-Type": songFile.type,
        },
      });

      if (!songUploadResponse.ok) {
        throw new Error("Song upload failed");
      }

      // upload images to S3
      const imageUploadResponse = await fetch(imageUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      if (!imageUploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      toast.success("Song and image uploaded successfully");

      // save the song to the database
      // const response = await fetch("/api/songs", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     title: values.title,
      //     artist: values.artist,
      //     songPath: songUrl,
      //     imagePath: imageUrl,
      //     userId: user.id,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save song");
      // }

      // setToastMessage("created");
      // setIsToastOpen(true);
      // reset();
      // console.log(songUrl);
      // console.log(imageUrl);
      // setToastMessage("created");
      // setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong while uploading...");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Add a song"
      description="Upload an MP3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("artist", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="artist"
          disabled={isLoading}
          {...register("artist", { required: true })}
          placeholder="Song artist"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
            onChange={handleChange}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Upload
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
