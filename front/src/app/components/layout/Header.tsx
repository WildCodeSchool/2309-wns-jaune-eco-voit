"use client";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
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
import { usePathname } from "next/navigation";
import { routes } from "@/app/lib/routes";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useGetProfileLazyQuery } from "@/types/graphql";

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
                <div className="w-72 flex justify-between">
                  <div className="entry flex-1 flex gap-2">
                    <PersonRoundedIcon /> <p>Mon profil</p>
                  </div>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => router.push(routes.journeysUser.pathname)}
              >
                <div className="w-72 flex justify-between">
                  <div className="entry flex-1 flex gap-2">
                    <DirectionsCarFilledOutlinedIcon /> <p>Mes trajets</p>
                  </div>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              {data?.getProfile.role && data?.getProfile.role === "ADMIN" ? (
                <MenuItem onClick={() => router.push(routes["admin"].pathname)}>
                  <div className="w-72 flex justify-between">
                    <div className="entry flex-1 flex gap-2">
                      <AdminPanelSettingsIcon />
                      <p>Admin</p>
                    </div>
                    <KeyboardArrowRightOutlinedIcon />
                  </div>
                </MenuItem>
              ) : null}

              {data?.getProfile.role && data?.getProfile.role === "ADMIN" ? (
                <Divider />
              ) : null}

              <MenuItem
                onClick={() => {
                  setOpen(true);
                  router.push(routes.logout.pathname);
                }}
              >
                <div className="w-72 flex justify-between">
                  <div className="entry flex-1 flex gap-2">
                    <CloseOutlinedIcon />
                    <p>Déconnexion</p>
                  </div>
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
