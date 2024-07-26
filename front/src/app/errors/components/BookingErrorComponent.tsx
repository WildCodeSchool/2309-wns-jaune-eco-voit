import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const BookingErrorComponent = () => {
  const router = useRouter();
  return (
    <>
      <Stack className="h-full w-full flex justify-center items-center gap-4">
        <Typography variant="h4" component="h2" align="center">
          Réservation introuvable
        </Typography>
        <Button onClick={() => router.push("/")}>Retourner à laccueil</Button>
      </Stack>
    </>
  );
};

export default BookingErrorComponent;
