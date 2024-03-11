"use client";

import React from "react";
import { useRouter } from "next/navigation";
// Components
import { Button } from "@mui/material";
import { routes } from "./lib/routes";

const Error = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-primary180">
      <h1 className="[font-size:_clamp(6em,20vw,15em)]">OOPS</h1>
      <p className="text-center mb-6 [font-size:_clamp(1em,1.5vw,2em)]">
        Une erreur s&apos;est produite
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

export default Error;
