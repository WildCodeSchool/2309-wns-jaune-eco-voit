"use client";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";
import { Button } from "@mui/material";
import { GetProfileDocument, useUpdateUserMutation } from "@/types/graphql";

const UploadPicture = () => {
  const [preview, setPreview] = useState<string>("");

  const { getUser: userId } = useContext(AuthContext);

  const [updateProfilePicture] = useUpdateUserMutation({
    onCompleted: () => {
      setPreview("");
    },
    refetchQueries: [{ query: GetProfileDocument }],
  });

  const handlePreviewAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
          // Update user profile with new picture
          updateProfilePicture({
            variables: { data: { id: userId, profilePicture: fileUrl } },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col align-center justify-center gap-4 w-full">
      {
        //To preview the file thumbnail
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
