"use client";

import React from "react";
import { useRouter } from "next/navigation";
// Components
import { Button } from "@mui/material";
import { routes } from "./lib/routes";

const error = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-primary180">
      <h1 className="[font-size:_clamp(6em,20vw,15em)]">OOPS</h1>
      <p className="text-center mb-6 [font-size:_clamp(1em,1.5vw,2em)]">
        Une erreur s'est produite
      </p>
      <Button
        variant="outlined"
        onClick={() => router.push(`${routes["home"].pathname}`)}
      >
        Retourner à l'accueil
      </Button>
    </div>
  );
};

export default error;

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-primary180">
      <h1 className="[font-size:_clamp(6em,20vw,15em)]">404</h1>
      <p className="text-center mb-6 [font-size:_clamp(1em,2vw,2em)]">
        Page introuvable
      </p>
      <Button
        variant="outlined"
        onClick={() => router.push(`${routes["home"].pathname}`)}
      >
        Retourner à l'accueil
      </Button>
    </div>
  );
};
