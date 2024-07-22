"use client";
//chore
import { SyntheticEvent, useContext, useEffect, useState } from "react";
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
import Image from "next/image";
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
import { useGetProfileLazyQuery } from "@/types/graphql";

import { usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggedUser, setLoggedUser] = useState<string>();
  const [userPicture, setUserPicture] = useState<string>();
  const { getUser, updateUser } = useContext(AuthContext);

  const [getUserDatas, { data, loading, error }] = useGetProfileLazyQuery({
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
  });

  useEffect(() => {
    if (data) {
      setUserPicture(data?.getProfile.profilePicture ?? undefined);
    }
  }, [data, loading, error]);

  useEffect(() => {
    setLoggedUser(Cookies.get("id") ?? "");
  }, [getUser]);

  useEffect(() => {
    const id = Cookies.get("id") ?? "";
    if (!getUser && id) {
      updateUser(id);
      //s'il y a un id dans le cookie
      //mais que le contexte ne continent pas d'utilisateur
      //alors on l'update
    }
    getUserDatas();
    setLoggedUser(getUser?.toString());
  }, [getUser, updateUser, getUserDatas]);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleCloseSnackbar = (
    event: SyntheticEvent | Event,
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
        <Image src={logo} alt="Ecovoit" height={45} width={145} />
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
              Inscription
            </Button>
          </>
        ) : (
          <>
            <span
              className={
                pathname === routes["publish-journey"].pathname
                  ? "hidden"
                  : "block"
              }
            >
              <div className="hidden md:block">
                <Button
                  variant="text"
                  className="flex items-center gap-4"
                  onClick={() =>
                    router.push(routes["publish-journey"].pathname)
                  }
                >
                  <AddCircleOutlineOutlinedIcon />
                  <p className="font-medium text-sm">Publier un trajet</p>
                </Button>
              </div>
              <div className="block md:hidden">
                <IconButton
                  aria-label="Nouveau Trajet"
                  className="flex items-center gap-4"
                  onClick={() =>
                    router.push(routes["publish-journey"].pathname)
                  }
                >
                  <AddCircleOutlineOutlinedIcon />
                </IconButton>
              </div>
            </span>
            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                }}
                color="inherit"
              >
                <Avatar alt="profile picture" src={userPicture} />
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
              <MenuItem
                onClick={() => router.push(routes["my-profile"].pathname)}
              >
                <div className="w-48 flex justify-between">
                  <PersonRoundedIcon /> <p>Mon profil</p>{" "}
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => router.push(routes.journeysUser.pathname)}
              >
                <div className="w-48 flex justify-between">
                  <DirectionsCarFilledOutlinedIcon /> <p>Mes trajets</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => router.push(routes.messaging.pathname)}
                disabled // TODO: Enable when messaging is implemented
              >
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
