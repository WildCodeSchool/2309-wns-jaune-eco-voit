import Image from "next/image";
import React from "react";
//Assets
import logo from "@/assets/logo_white.webp";

const Footer = () => {
  return (
    <footer className="footer p-6 flex flex-col gap-4 justify-center items-center bg-primary100 text-white text-center text-sm">
      <Image src={logo} alt="Ecovoit" height={40} />
      <p>©Asma - Alex - Marie-Lou - Olive</p>
    </footer>
  );
};

export default Footer;
