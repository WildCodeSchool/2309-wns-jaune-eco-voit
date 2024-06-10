"use client";
import React, { SetStateAction, useContext, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";
import { GetProfileDocument, useUpdateUserMutation } from "@/types/graphql";
import { Button } from "@mui/material";

const UploadPofilePicture = ({
  setIsEditPictureModalOpen,
  profilePictureUrl,
}: {
  profilePictureUrl: string;
  setIsEditPictureModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { getUser: userId } = useContext(AuthContext);

  const [updateProfilePicture] = useUpdateUserMutation({
    onCompleted: () => {
      setPreview("");
      setIsEditPictureModalOpen(false);
    },
    refetchQueries: [{ query: GetProfileDocument }],
  });
  const [preview, setPreview] = useState<string>("");

  const handlePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const avatar = formData.get("avatar") as File;
    if (!avatar.name || !userId) return;

    fetch(`${process.env.NEXT_PUBLIC_IMAGES_URI}/profile`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const fileUrl = `${process.env.NEXT_PUBLIC_IMAGES_URI}/avatar/${data.filename}`;
          // Update user profile with new picture
          updateProfilePicture({
            variables: { data: { id: userId, profilePicture: fileUrl } },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {
        //To preview the file thumbnail
        <Image
          src={preview ? preview : profilePictureUrl}
          alt="avatar"
          height={200}
          width={200}
          className="rounded-full object-cover h-36 w-36"
          unoptimized // pour éviter que Next ne renomme l'URL avec des caractère spéciaux
        />
      }
      <form
        className="flex flex-col items-center gap-4 w-full"
        onSubmit={(e) => handleFileUpload(e)}
      >
        <label
          htmlFor="avatar"
          className="overflow-hidden cursor-pointer px-3 py-2 hover:bg-primary40 bg-primary20 rounded-md w-auto"
        >
          <input
            className="w-0"
            id="avatar"
            name="avatar"
            type="file"
            onChange={handlePreviewAvatar}
            accept="image/png, image/jpeg"
          />
          Choisissez une photo
        </label>
        <Button
          className="w-full"
          variant="contained"
          type="submit"
          disabled={!preview}
        >
          Valider
        </Button>
      </form>
    </div>
  );
};

export default UploadPofilePicture;
