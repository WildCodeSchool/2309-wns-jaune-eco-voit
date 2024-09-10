"use client";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context/authContext";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import JourneyCardHeader from "@/app/components/JourneyCard/JourneyCardHeader";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import {
  useAcceptBookingMutation,
  useFindBookingByIdLazyQuery,
  useFindUserByIdLazyQuery,
  useRejectBookingMutation,
} from "@/types/graphql";
import { routes } from "@/app/lib/routes";

const AcceptPage = ({
  params: {
    parametres: [bookingId, driverId],
  },
}: {
  params: { parametres: Array<string> };
}) => {
  const router = useRouter();
  const { userId } = useContext(AuthContext);
  const [isAccepted, setIsAccepted] = useState<boolean>();

  const [
    findBookingById,
    { data: bookingDatas, error: bookingError, loading: bookingLoading },
  ] = useFindBookingByIdLazyQuery();

  const [
    findUserById,
    { data: userDatas, error: userError, loading: userLoading },
  ] = useFindUserByIdLazyQuery();

  const [
    acceptBooking,
    { error: acceptBookingError, loading: acceptBookingLoading },
  ] = useAcceptBookingMutation({});

  const [
    rejectBooking,
    { error: rejectBookingError, loading: rejectBookingLoading },
  ] = useRejectBookingMutation({});

  const handleAccept = () => {
    acceptBooking({
      variables: {
        acceptBookingId: bookingId,
      },
      onCompleted: () => {
        setIsAccepted(true);
        setTimeout(() => {
          router.push(routes["home"].pathname);
        }, 1000);
      },
    });
  };

  const handleReject = () => {
    rejectBooking({
      variables: {
        rejectBookingId: bookingId,
      },
      onCompleted: () => {
        setIsAccepted(false);
        setTimeout(() => {
          router.push(routes["home"].pathname);
        }, 1000);
      },
    });
  };

  useEffect(() => {
    if (bookingId && driverId) {
      findBookingById({ variables: { findBookingById: bookingId } });
      findUserById({ variables: { findUserById: driverId } });
    }
  }, [bookingId, driverId, findBookingById, findUserById]);

  if (!bookingDatas || !userDatas) {
    return null;
  }

  if (bookingLoading || userLoading) {
    return <CircularLoading />;
  }

  const {
    findBookingById: {
      journey: { departureTime, origin, destination },
      user: {
        id: passengerId,
        firstname: passengerFirstname,
        profilePicture: passengerProfilPicture,
      },
      status: bookingStatus,
      nbPassenger,
    },
  } = bookingDatas;

  if (driverId !== userId) {
    return (
      <div className="flex items-center justify-center">
        Vous n&apos;êtes pas autorisé à accepter ce booking
      </div>
    );
  }

  if (bookingStatus !== "PENDING") {
    return (
      <div className="flex items-center justify-center">
        Ce booking ne peut plus etre accepté
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 items-center justify-center h-full py-8">
      <h2 className="text-center">
        {passengerFirstname} souhaite réserver {nbPassenger} place
        {nbPassenger > 1 && "s"} sur votre trajet !
      </h2>
      <div className="booking_infos flex flex-col gap-3 shadow-md py-6 px-10 rounded-lg">
        <AvatarJourney
          id={passengerId}
          firstname={passengerFirstname}
          profilePicture={passengerProfilPicture ?? undefined}
        />
        <JourneyCardHeader
          departureTime={departureTime}
          origin={origin}
          destination={destination}
        />
      </div>
      {isAccepted === undefined ? (
        <div className="flex gap-4 items-center">
          {acceptBookingLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleAccept}>Accepter</Button>
          )}
          {rejectBookingLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleReject}>Refuser</Button>
          )}
        </div>
      ) : isAccepted === false ? (
        <div className="flex flex-col gap-4 items-center">
          Vous avez refusé cette réservation.
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          Vous avez accepté cette réservation.
        </div>
      )}
    </div>
  );
};

export default AcceptPage;
