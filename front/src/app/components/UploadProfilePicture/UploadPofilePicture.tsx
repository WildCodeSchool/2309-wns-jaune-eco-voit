"use client";
import { Avatar, Button } from "@mui/material";
import { ChangeEvent, FormEvent, useContext, useState } from "react";

import { AuthContext } from "@/context/authContext";
import { GetProfileDocument, useUpdateUserMutation } from "@/types/graphql";

const UploadPofilePicture = ({
  onCloseEditPictureModal,
  profilePictureUrl,
}: {
  profilePictureUrl?: string | null;
  onCloseEditPictureModal: () => void;
}) => {
  const { getUser: userId } = useContext(AuthContext);

  const [updateProfilePicture] = useUpdateUserMutation({
    onCompleted: () => {
      setPreview("");
      onCloseEditPictureModal();
    },
    refetchQueries: [{ query: GetProfileDocument }],
  });
  const [preview, setPreview] = useState<string>("");

  const handlePreviewAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleFileUpload = (e: FormEvent<HTMLFormElement>) => {
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
        <Avatar
          alt="profile picture"
          src={preview ? preview : profilePictureUrl ? profilePictureUrl : ""}
          sx={{ width: 150, height: 150 }}
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
