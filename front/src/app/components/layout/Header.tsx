"use client";
//chore
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
//Assets
import logo from "@/assets/Logo.webp";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/lib/routes";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useGetProfileLazyQuery, useGetProfileQuery } from "@/types/graphql";

const Header = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggedUser, setLoggedUser] = useState<string | undefined>(undefined);
  const [userUserPicture, setUserUserPicture] = useState<string | undefined>(
    undefined
  );
  const { getUser, updateUser } = useContext(AuthContext);

  const [getUserDatas, { data, loading, error }] = useGetProfileLazyQuery({
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setUserUserPicture(data?.getProfile?.profilePicture ?? undefined);
    }
  }, [data, loading, error]);

  useEffect(() => {
    setLoggedUser(Cookies.get("id") ?? "");
  }, [getUser]);

  useEffect(() => {
    const id = Cookies.get("id") ?? "";
    if (!getUser && id) {
      updateUser(id);
    }
    getUserDatas();
    setLoggedUser(getUser?.toString());
  }, [getUser, updateUser, getUserDatas]);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <header className="flex justify-between items-center py-6 px-6 bg-white">
      <Link href={`${routes["home"].pathname}`}>
        <Image src={logo} alt="Ecovoit" height={45} />
      </Link>
      <nav className="flex gap-4 items-center">
        {!loggedUser ? (
          <>
            <Button onClick={() => router.push(routes.login.pathname)}>
              Connexion
            </Button>
            <Button
              onClick={() => router.push(routes.register.pathname)}
              variant="contained"
            >
              S&apos;inscrire
            </Button>
          </>
        ) : (
          <>
            <Button
              href="#"
              variant="text"
              className="flex items-center gap-4"
              onClick={() => router.push(routes["publish-journey"].pathname)}
            >
              <AddCircleOutlineOutlinedIcon />
              <p className="font-medium text-sm">Publier un trajet</p>
            </Button>
            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                }}
                color="inherit"
              >
                <Avatar
                  alt="profile picture"
                  src={
                    !userUserPicture
                      ? "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
                      : userUserPicture
                  }
                />
              </IconButton>
            </Tooltip>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              className="m-4"
            >
              <MenuItem onClick={() => router.push(routes.profile.pathname)}>
                <div className="w-48 flex justify-between">
                  <PersonRoundedIcon /> <p>Mon profil</p>{" "}
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => router.push(routes.journeys.pathname)}>
                <div className="w-48 flex justify-between">
                  <DirectionsCarFilledOutlinedIcon /> <p>Mes trajets</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => router.push(routes.messaging.pathname)}>
                <div className="w-48 flex justify-between">
                  <ModeCommentOutlinedIcon />
                  <p>Messagerie</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  setOpen(true);
                  router.push(routes.logout.pathname);
                }}
              >
                <div className="w-48 flex justify-between">
                  <CloseOutlinedIcon />
                  <p>Déconnexion</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>
            </Menu>
          </>
        )}
      </nav>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        message="Vous êtes déconnecté"
      />
    </header>
  );
};

export default Header;
