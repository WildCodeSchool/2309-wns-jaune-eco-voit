"use client";

import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  GetProfileDocument,
  UserProfile,
  useGetProfileQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import dayjs from "dayjs";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import UploadProfilePictureModal from "../../components/UploadProfilePicture/UploadProfilePictureModal";
import ChangePasswordModal from "@/app/components/ChangePassword/ChangePasswordModal";

function MyProfile() {
  const { data, loading, error } = useGetProfileQuery({
    fetchPolicy: "network-only", // Used for first execution:  : permet d'afficher les nouvelles informations enregistrer sans rafraichir la page
    nextFetchPolicy: "cache-first", // Used for subsequent executions
  });

  const { getUser: userId } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isEditPictureModalOpen, setIsEditPictureModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangePasswordError, setIsChangePasswordError] = useState(false);
  const [updateInfos, setUpdateInfos] =
    useState<Omit<UserProfile, "id" | "averageRate">>();

  useEffect(() => {
    if (data) {
      const { averageRate, ...rest } = data.getProfile;
      setUpdateInfos(rest);
    }
  }, [data]);

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: [{ query: GetProfileDocument }],
  });

  const [updateUserPassword, { error: updatePasswordError }] =
    useUpdateUserPasswordMutation();

  if (!userId) {
    // TODO Gerer erreur
    return <div>Erreur</div>;
  }

  const handleSave = () => {
    updateUser({
      variables: { data: { ...updateInfos, id: userId } },

      onCompleted() {
        setIsEditing(false); // une fois la mise à jour terminée, désactiver le mode édition
      },
    });
  };

  const resetPasswordInputs = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleOnCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    resetPasswordInputs();
    setIsChangePasswordError(false);
  };

  const handlePasswordSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setIsChangePasswordError(true);
      return;
    }
    updateUserPassword({
      variables: {
        data: { id: userId, newPassword, oldPassword },
      },
      onError() {
        setIsChangePasswordError(true);
      },
      onCompleted() {
        setIsEditing(false);
        handleOnCloseChangePasswordModal();
      },
    });
  };
  const formatDate = dayjs(updateInfos?.dateOfBirth).format("DD/MM/YYYY");

  if (loading) {
    return <CircularLoading />;
  }

  //TODO Gérer l'erreur
  if (error || !data || !updateInfos) {
    return <div>Error</div>;
  }

  const {
    firstname,
    lastname,
    email,
    dateOfBirth,
    phoneNumber,
    role,
    profilePicture,
  } = updateInfos;

  return (
    <div className="home_page flex flex-col gap-6  bg-primary10 py-10">
      <h1 className="Title  flex flex-col justify-center items-center py-10">
        Mon profil
      </h1>
      <div className="header-Profil flex flex-col justify-center items-center py-10">
        <h3 className="font-medium uppercase tracking-widest">{firstname}</h3>
        <Tooltip
          title="Profile_picture"
          className="flex flex-col justify-r items-center py-10"
        >
          <IconButton color="inherit">
            <Avatar
              alt="profile picture"
              sx={{ width: 110, height: 110 }}
              src={profilePicture ?? undefined}
              onClick={() => setIsEditPictureModalOpen(true)}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="body-profile flex flex-col justify-center items-center py-10  ">
        {!isEditing && (
          <div className="flex flex-col gap-8 w-3/4">

            <h4>Prenom : {data?.getProfile?.firstname}</h4>
            <h4>Nom : {data?.getProfile?.lastname}</h4>
            <h4>E-mail : {data?.getProfile?.email}</h4>
            <h4>Date de naissance : {formatDate}</h4>
            <h4>Numéro de téléphone : {data?.getProfile?.phoneNumber}</h4>
            <h4>Role : {data?.getProfile?.role}</h4>

            <div className="ModalPassword bg-primary10 flex flex-col justify-center items-center py-10">
              <Button onClick={() => setIsEditing(true)}>Editer</Button>
            </div>
          </div>
        )}
        {isEditing && (
          <div className="flex flex-col gap-8 w-3/4">
            <FormControl className="FormControl">
              <FormLabel>Prenom :</FormLabel>
              <Input
                sx={{ marginTop: "0.5em!important" }}
                autoFocus
                value={firstname}
                onChange={(e) =>
                  setUpdateInfos((prevState: any) => ({
                    ...prevState,
                    firstname: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl className="FormControl">
              <FormLabel>Nom :</FormLabel>
              <Input
                value={lastname}
                sx={{ marginTop: "0.5em!important" }}
                onChange={(e) =>
                  setUpdateInfos((prevState: any) => ({
                    ...prevState,
                    lastname: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl className="FormControl">
              <FormLabel>E-mail :</FormLabel>
              <Input
                onChange={(e) =>
                  setUpdateInfos((prevState: any) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
                value={email}
                sx={{ marginTop: "0.5em!important" }}
              />
            </FormControl>

            <FormControl className="FormControl">
              <FormLabel>Date de naissance :</FormLabel>
              <Input
                value={formatDate}
                sx={{ marapinTop: "0.5em!important" }}
                onChange={(e) =>
                  setUpdateInfos((prevState: any) => ({
                    ...prevState,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl className="">
              <FormLabel>Numéro de téléphone :</FormLabel>
              <Input
                onChange={(e) =>
                  setUpdateInfos((prevState: any) => ({
                    ...prevState,
                    phoneNumber: e.target.value,
                  }))
                }
                value={phoneNumber}
                sx={{ marginTop: "0.5em!important" }}
              />
            </FormControl>

            <div className="flex gap-4 mt-8 ModalPassword">
              <Button onClick={() => setIsChangePasswordModalOpen(true)}>
                Modifier votre mot de passe
              </Button>
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        )}
      </div>

      {isEditPictureModalOpen && (
        <UploadProfilePictureModal
          onCloseEditPictureModal={() => setIsEditPictureModalOpen(false)}
          profilePicture={profilePicture}
        />
      )}

      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          onCloseModal={handleOnCloseChangePasswordModal}
          onChangeOldPassword={(value) => {
            setIsChangePasswordError(false);
            setOldPassword(value);
          }}
          onChangeConfirmNewPassword={(value) => {
            setIsChangePasswordError(false);
            setConfirmNewPassword(value);
          }}
          onChangeNewPassword={(value) => {
            setIsChangePasswordError(false);
            setNewPassword(value);
          }}
          onSavePassword={(e) => handlePasswordSave(e)}
          oldPassword={oldPassword}
          newPassword={newPassword}
          confirmNewPassword={confirmNewPassword}
          isError={isChangePasswordError}
        />
      )}
    </div>
  );
}

export default MyProfile;
