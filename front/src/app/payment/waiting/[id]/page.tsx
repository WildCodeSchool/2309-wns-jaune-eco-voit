"use client";

import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { useFindBookingByIdQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import MyBookingCard from "@/app/components/MyBooking/MyBookingCard";
import { routes } from "@/app/lib/routes";
import BookingErrorComponent from "@/app/errors/components/BookingErrorComponent";
import { Typography } from "@mui/material";

const Page = ({ params: { id: bookingId } }: { params: { id: string } }) => {
  const { userId } = useContext(AuthContext);
  const router = useRouter();

  const {
    data: bookingData,
    error: bookingError,
    loading: getBookingLoading,
    refetch: refetchBooking,
  } = useFindBookingByIdQuery({
    variables: { findBookingById: bookingId },
  });

  useEffect(() => {}, [bookingData]);

  if (bookingError) return <BookingErrorComponent />;

  if (getBookingLoading) {
    return <CircularLoading />;
  }

  if (!bookingData?.findBookingById) return <BookingErrorComponent />;

  const booking = bookingData.findBookingById;

  if (userId !== booking.user.id) {
    return (
      <div className="flex items-center justify-center">
        Vous n&apos;êtes pas autorisé à payer ce booking
      </div>
    );
  }

  const bookingStatusToDisplay = () => {
    switch (booking.status) {
      case "PENDING":
        return "Réservation en attente de validation";
      case "REJECTED":
        return "Réservation refusée";
      case "CANCELLED":
        return "Réservation annulée";
      case "ACCEPTED":
        return "Veuillez procéder au paiement";
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
    <div className="flex flex-col gap-12 items-center justify-center h-full py-8 px-8">
      <Typography variant="h4" component="h2" align="center">
        {bookingStatusToDisplay()}
      </Typography>
      {booking.status === "ACCEPTED" && (
        <MyBookingCard
          booking={booking}
          onCompleteCancelBooking={() => {
            setTimeout(
              () =>
                router.push(`${routes["journeysUser"].pathname}?tab=BOOKINGS`),
              1000
            );
          }}
          bookingsRefetch={refetchBooking}
        />
      )}
    </div>
  );
};
export default Page;
