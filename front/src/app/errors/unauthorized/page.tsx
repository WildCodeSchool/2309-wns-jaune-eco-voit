"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { routes } from "@/app/lib/routes";

const Unauthorized = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-primary180">
      <h1 className="[font-size:_clamp(3.5em,9vw,10em)] text-center">
        Accès réfusé
      </h1>
      <p className="text-center mb-6 [font-size:_clamp(1em,1.5vw,2em)]">
        Vous n&apos;êtes pas autorisé à accéder à cette page
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

export default Unauthorized;
