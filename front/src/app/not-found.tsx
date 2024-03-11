"use client";
import React from "react";
import { useRouter } from "next/navigation";
// Components
import { Button } from "@mui/material";
import { routes } from "./lib/routes";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-primary180">
      <h1 className="[font-size:_clamp(6em,20vw,15em)]">404</h1>
      <p className="text-center font-medium mb-8 [font-size:_clamp(1em,1.8vw,2em)]">
        Page introuvable
      </p>
      <Button
        variant="outlined"
        onClick={() => router.push(`${routes["home"].pathname}`)}
      >
        Retourner à l&apos;accueil
      </Button>
    </div>
  );
};

export default NotFound;
