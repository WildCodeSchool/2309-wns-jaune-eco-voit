"use client";

import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { routes } from "@/app/lib/routes";
import { usePaidBookingMutation } from "@/types/graphql";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentSuccess = ({
  params: { id: bookingId },
}: {
  params: { id: string };
}) => {
  const router = useRouter();

  const [paidBooking, { error }] = usePaidBookingMutation({
    variables: {
      bookingPaidId: bookingId,
    },
    onCompleted: () => {
      setTimeout(() => {
        router.push(`${routes["journeysUser"].pathname}?tab=BOOKINGS`);
      }, 1000);
    },
  });

  useEffect(() => {
    paidBooking();
  }, []);

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-8">
      <Typography variant="h4" component="h2" align="center">
        Votre réservation a bien été prise en compte
      </Typography>
    </div>
  );
};
export default PaymentSuccess;
