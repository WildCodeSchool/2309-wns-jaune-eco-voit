"use client";

import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import BookingErrorComponent from "@/app/errors/components/BookingErrorComponent";
import { routes } from "@/app/lib/routes";
import { useFindBookingByIdQuery } from "@/types/graphql";
import { Button, Stack, Typography } from "@mui/material";
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
    if (!data?.findBookingById) return;
    setTimeout(() => {
      router.push(`${routes["journeysUser"].pathname}?tab=BOOKINGS`);
    }, 1000);
  }, [data]);

  if (error) return <BookingErrorComponent />;

  if (loading) return <CircularLoading />;

  if (!data?.findBookingById) return <BookingErrorComponent />;

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
