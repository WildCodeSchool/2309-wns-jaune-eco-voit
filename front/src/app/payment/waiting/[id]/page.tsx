"use client";

import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useFindBookingByIdQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import MyBookingCard from "@/app/components/MyBooking/MyBookingCard";
import { routes } from "@/app/lib/routes";

const Page = ({ params: { id: bookingId } }: { params: { id: string } }) => {
  const { getUser: userId } = useContext(AuthContext);
  const router = useRouter();

  const { data: bookingData, loading: getBookingLoading } =
    useFindBookingByIdQuery({
      variables: { findBookingById: bookingId },
    });

  if (getBookingLoading) {
    return <CircularLoading />;
  }

  if (!bookingData) {
    // TODO Gerer erreur
    return null;
  }

  const booking = bookingData.findBookingById;

  if (userId !== booking.user.id) {
    return (
      <div className="flex items-center justify-center">
        Vous n&apos;êtes pas autorisé à payer ce booking
      </div>
    );
  }

  return (
    <div className="w-6/12 m-auto flex flex-col gap-6">
      <MyBookingCard
        booking={booking}
        onCompleteCancelBooking={() =>
          router.push(routes.journeysUser.pathname)
        }
      />
    </div>
  );
};
export default Page;
