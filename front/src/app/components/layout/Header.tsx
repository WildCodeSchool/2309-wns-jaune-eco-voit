"use client";
//chore
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCookie, CookieValueTypes } from "cookies-next";
//Assets
// import logo from "@/assets/Logo.webp";
import { Avatar, Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/lib/routes";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

export type UserInfos = {
  email: CookieValueTypes;
  role: CookieValueTypes;
  firstname: CookieValueTypes;
};

const Header = () => {
  const [userInfos, setUserInfos] = useState<UserInfos>({
    email: "",
    role: "",
    firstname: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = getCookie("email") ?? "";
      const firstname = getCookie("firstname") ?? "";
      const role = getCookie("role") ?? "";
      setUserInfos({ email, role, firstname });
    }
  }, []);
  
  return (
    <header className="flex justify-between items-center py-6 px-6">
      <Link href={`${routes["home"].pathname}`}>
        {/* <Image src={logo} alt="Ecovoit" height={45} /> */}
      </Link>
      <nav className="flex gap-4 items-center">
        {!userInfos?.email ? (
          <>
            <Link href="/auth/login">
              <Button>Connexion</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="contained">S&apos;inscrire</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="#" className="flex items-center gap-1">
              <AddCircleOutlineOutlinedIcon />
              <p className="font-medium text-sm">Publier un trajet</p>
            </Link>
            <Link href="/auth/logout">
              <Button variant="contained">Déconnexion</Button>
            </Link>
            <Avatar
              alt="profile picture"
              src="https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
            />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
