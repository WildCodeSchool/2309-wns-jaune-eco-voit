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
import { useFindUserByIdLazyQuery } from "@/types/graphql";
import { getCookie } from "cookies-next";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [findUser, { data, error }] = useFindUserByIdLazyQuery();

  const { user, updateUser, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
    const userIdCookie = getCookie("id");
    console.log(userIdCookie);

    if (!userIdCookie && !user) return;

    if (!userIdCookie && user) {
      console.log("no cookies");
      logout();
      return;
    }

    if (user?.id !== userIdCookie) {
      findUser({
        variables: { findUserById: userIdCookie as string },
        onCompleted(data) {
          console.log(data);
          updateUser(data.findUserById);
        },
      });
    }
  }, [findUser, user, logout, updateUser]);

  return (
    <header className="flex justify-between items-center py-6 px-6">
      <Link href={`${routes["home"].pathname}`}>
        <Image src={logo} alt="Ecovoit" height={45} />
      </Link>
      <nav className="flex gap-4 items-center">
        {!user ? (
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
              onClick={() => router.push(routes.publish.pathname)}
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
                  src="https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
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
                <div className="w-72 flex justify-between">
                  <PersonRoundedIcon /> <p>Mon profil</p>{" "}
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => router.push(routes.journeys.pathname)}>
                <div className="w-72 flex justify-between">
                  <DirectionsCarFilledOutlinedIcon /> <p>Mes trajets</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => router.push(routes.messaging.pathname)}>
                <div className="w-72 flex justify-between">
                  <ModeCommentOutlinedIcon />
                  <p>Ma messagerie</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => router.push(routes.logout.pathname)}>
                <div className="w-72 flex justify-between">
                  <CloseOutlinedIcon />
                  <p>Déconnexion</p>
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </MenuItem>
            </Menu>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
