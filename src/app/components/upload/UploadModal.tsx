"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import useUploadModal from "../../hooks/useUploadModal";
import Input from "../Input";
import Button from "../Button";
import toast from "react-hot-toast";
import ToastMessage from "../toastMessage/toastmessage";
import { getSignedURL, uploadFile } from "@/app/action/upload-action";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isToastOpen, setToastOpen] = useState(false);
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
      setFile(undefined);
      setFileUrl(undefined);
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
      const [songSignedURLResult, imageSignedURLResult] = await Promise.all([
        getSignedURL({
          fileName: songFile.name,
          fileType: songFile.type,
          fileSize: songFile.size,
          checksum: checksumSongFile,
        }),
        getSignedURL({
          fileName: imageFile.name,
          fileType: imageFile.type,
          fileSize: imageFile.size,
          checksum: checksumImageFile,
        }),
      ]);

      console.log("url result", songSignedURLResult, imageSignedURLResult);
      // const songSignedURLResult = await getSignedURL({
      //   fileName: songFile.name,
      //   fileType: songFile.type,
      //   fileSize: songFile.size,
      //   checksum: checksumSongFile,
      // });

      if (
        songSignedURLResult.failure !== undefined ||
        imageSignedURLResult.failure !== undefined
      ) {
        console.error(
          "Failed to get signed URL for song and image",
          songSignedURLResult.failure,
          imageSignedURLResult.failure
        );

        // setToastMessage("Failed to sign URL");
        // setToastOpen(true);
        return;
      }

      const songSignedUrl = songSignedURLResult.success.url;
      const imageSignedUrl = imageSignedURLResult.success.url;
      console.log(songSignedUrl);
      console.log(imageSignedUrl);

      // upload songs to S3
      const songUploadResponse = await fetch(songSignedUrl, {
        method: "PUT",
        body: songFile,
        headers: {
          "Content-Type": songFile.type,
        },
      });

      if (!songUploadResponse.ok) {
        console.error(
          "Song upload failed",
          songUploadResponse.status,
          songUploadResponse.statusText
        );

        throw new Error("Song upload failed");
      }

      // upload images to S3
      const imageUploadResponse = await fetch(imageSignedUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      if (!imageUploadResponse.ok) {
        console.error(
          "Image upload failed",
          imageUploadResponse.status,
          imageUploadResponse.statusText
        );

        throw new Error("Image upload failed");
      }
      await uploadFile({
        title: values.title,
        artist: values.artist,
        songPath: songSignedUrl,
        imagePath: imageSignedUrl,
      });
      setToastMessage("Song and image uploaded successfully");
      onChange(false);
      reset();

      // setToastMessage("Failed to sign URL for image");
      // setToastOpen(true);
      console.error("error");
      return;
    } catch (error) {
      console.error("Error in file upload process:", error);

      // setToastMessage("Something went wrong while uploading...");
    } finally {
      setIsLoading(false);
      setToastOpen(false);
    }
  };
  return (
    <div>
      <Modal
        title="Add a song"
        description="Upload an MP3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: "Title is required" })}
            placeholder="Song title"
          />
          <Input
            id="artist"
            disabled={isLoading}
            {...register("artist", { required: "Artist name is required" })}
            placeholder="Song artist"
          />
          <div>
            <div className="pb-1">Select a song file</div>
            <Input
              id="song"
              type="file"
              disabled={isLoading}
              accept=".mp3"
              {...register("song", { required: "Song file is required" })}
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
              {...register("image", { required: "Image is required" })}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Upload
          </Button>
        </form>
      </Modal>

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

export default UploadModal;
