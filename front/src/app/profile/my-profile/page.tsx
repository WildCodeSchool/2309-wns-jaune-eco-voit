"use client";

import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  GetProfileDocument,
  useGetProfileQuery,
  useUpdateUserMutation,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";

function MyProfile() {
  const { data, loading, error } = useGetProfileQuery({
    fetchPolicy: "network-only",
  }); // fetchPolicy: "network-only" : permet d'afficher les nouvelles informations enregistrer sans rafraichir la page
  const [updateUser] = useUpdateUserMutation({
    refetchQueries: [{ query: GetProfileDocument }],
  });
  const { getUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [updateInfos, setUpdateInfos] = useState<any>({});

  useEffect(() => {
    if (data) {
      setUpdateInfos(data?.getProfile);
    }
  }, [data]);

  console.log("updateInfos", updateInfos);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    updateUser({
      variables: { data: { ...updateInfos, id: getUser } },
      onCompleted(data, clientOptions) {
        setIsEditing(false); // une fois la mise à jour terminée, désactiver le mode édition
      },
    });
    setIsEditing(false);
  };

  const handlePasswordSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      updateUser({
        variables: {
          data: { ...updateInfos, id: getUser, password: newPassword },
        },
        onCompleted(data, clientOptions) {
          console.log("Mot de passe mis à jour");
          handleClose();
        },
      });
    } else {
      console.log("Les mots de passe ne sont pas identiques");
    }
    setOpen(false);
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="home_page flex flex-col gap-6 h-full  bg-primary10 py-10">
      <h1 className="Title  flex flex-col justify-center items-center py-10">
        Mon profil
      </h1>
      <div className="header-Profil flex flex-col justify-center items-center py-10">
        <h3 className="font-medium uppercase tracking-widest">
          {data?.getProfile?.firstname}
        </h3>
        <Tooltip
          title="Profile_picture"
          className="flex flex-col justify-r items-center py-10"
        >
          <IconButton color="inherit">
            <Avatar
              alt="profile picture"
              sx={{ width: 126, height: 126 }}
              src={updateInfos.picture}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="body-profile flex flex-col justify-center items-center py-10 ">
        {!isEditing && (
          <div className="flex flex-col gap-8 w-3/4">
            <h4>Prenom : {data?.getProfile?.firstname}</h4>
            <h4>Nom : {data?.getProfile?.lastname}</h4>
            <h4>E-mail : {data?.getProfile?.email}</h4>
            <h4>Date de naissance : {data?.getProfile?.dateOfBirth}</h4>
            <h4>Numéro de téléphone : {data?.getProfile?.phoneNumber}</h4>
            <h4>Role : {data?.getProfile?.role}</h4>
            <div className="ModalPassword bg-primary10 flex flex-col justify-center items-center py-10">
              <Button onClick={handleEdit}>Editer</Button>
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
                value={updateInfos.firstname}
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
                value={updateInfos.lastname}
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
                value={updateInfos.email}
                sx={{ marginTop: "0.5em!important" }}
              />
            </FormControl>

            <FormControl className="FormControl">
              <FormLabel>Date de naissance :</FormLabel>
              <Input
                value={updateInfos.dateOfBirth}
                sx={{ marginTop: "0.5em!important" }}
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
                value={updateInfos.phoneNumber}
                sx={{ marginTop: "0.5em!important" }}
              />
            </FormControl>

            <div className="flex gap-4 mt-8 ModalPassword">
              <Button onClick={handleOpen}>Modifier votre mot de passe</Button>
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button onClick={handleCancel}>Annuler</Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box component="section" sx={{ p: 2, backgroundColor: "#fff" }}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Changement de mot de passe
          </Typography>
          <form onSubmit={handlePasswordSave}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Ancien mot de passe :</FormLabel>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nouveau mot de passe :</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirmer le nouveau mot de passe :</FormLabel>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </FormControl>
              <Button type="submit" onClick={handleSave}>
                Enregistrer
              </Button>
              <Button onClick={handleClose}>Annuler</Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default MyProfile;
