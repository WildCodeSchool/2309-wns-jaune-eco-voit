"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";
import { useUpdateUserMutation } from "@/types/graphql";
import { Button } from "@mui/material";

const UploadPicture = () => {
  const [preview, setPreview] = useState<string>("");

  const { getUser: userId } = useContext(AuthContext);
  const [updateProfilePicture, { data }] = useUpdateUserMutation({
    onCompleted: () => {
      console.log("data", data);
    },
  });
  const handlePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!preview) return;
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
          const fileUrl = `${process.env.NEXT_PUBLIC_IMAGES_URI}${data.filename}`;
          console.log("fileUrl", fileUrl);
          console.log("data", data);
          console.log("userId", userId);
          updateProfilePicture({
            variables: { data: { id: userId, profilePicture: fileUrl } },
            // TODO vérifier : peut être que c'est profilPicture sans le "e"
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col align-center justify-center gap-4 w-full">
      {
        //To show the preview
        preview && <Image src={preview} alt="avatar" height={200} width={200} />
      }
      <form
        className="flex flex-col gap-4 text-center"
        onSubmit={(e) => handleFileUpload(e)}
      >
        <input
          className="w-fit"
          name="avatar"
          type="file"
          onChange={handlePreviewAvatar}
          accept="image/png, image/jpeg"
        />
        <Button className="w-fit" variant="contained" type="submit">
          Valider
        </Button>
      </form>
    </div>
  );
};

export default UploadPicture;
