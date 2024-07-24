"use client";

import { usePaidBookingMutation } from "@/types/graphql";
import { useEffect } from "react";

const Page = ({ params: { id: bookingId } }: { params: { id: string } }) => {
  const [paidBooking] = usePaidBookingMutation({
    variables: {
      bookingPaidId: bookingId,
    },
  });

  useEffect(() => {
    paidBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Votre réservation a été prise en compte</div>;
};

export default Page;
