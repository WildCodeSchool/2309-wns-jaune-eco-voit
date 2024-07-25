"use client";

import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { useFindBookingByIdQuery } from "@/types/graphql";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data, loading, error } = useFindBookingByIdQuery({
    variables: {
      findBookingById: params.id,
    },
  });

  useEffect(() => {
    if (!data) return;
    setTimeout(() => {
      router.push(`/profile/my-journeys?tab=BOOKINGS`);
    }, 1000);
  }, [data]);

  if (error) {
    return (
      <Typography variant="h4" component="h1" align="center">
        Erreur: {error.message}
      </Typography>
    );
  }

  if (loading) return <CircularLoading />;

  if (!data?.findBookingById) {
    return (
      <>
        <Typography variant="h4" component="h1" align="center">
          Réservation introuvable
        </Typography>
        <button>Retourne à l&eapos;accueil</button>
      </>
    );
  }

  const { status } = data?.findBookingById;

  const bookingStatusToDisplay = () => {
    switch (status) {
      case "PENDING":
        return "Réservation en attente de validation";
      case "REJECTED":
        return "Réservation refusée";
      case "CANCELLED":
        return "Réservation annulée";
      case "ACCEPTED":
        return "Réservation en attente de paiement";
      case "PAID":
        return "Réservation payée";
      case "DONE":
        return "Réservation passée";
      case "RATED":
        return "Réservation passée";
      default:
        return "Réservation non trouvée";
    }
  };

  return (
    <Stack className="h-full w-full flex justify-center items-center">
      <Typography variant="h4" component="h1" align="center">
        {bookingStatusToDisplay()}
      </Typography>
    </Stack>
  );
}
