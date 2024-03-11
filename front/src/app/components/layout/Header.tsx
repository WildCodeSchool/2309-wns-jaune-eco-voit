"use client";
import React from "react";
import Image from "next/image";

//Assets
import logo from "@/assets/Logo.webp";
import { Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/lib/routes";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 px-6">
      <Link href={`${routes["home"].pathname}`}>
        <Image src={logo} alt="Ecovoit" height={45} />
      </Link>
      <nav className="flex gap-3">
        <Button>Connexion</Button>
        <Button variant="contained">S&apos;inscrire</Button>
      </nav>
    </header>
  );
};

export default Header;
