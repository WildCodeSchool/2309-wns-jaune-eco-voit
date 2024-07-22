"use client";
import { useContext, useEffect, useState } from "react";
import {
  useAcceptBookingMutation,
  useFindBookingByIdLazyQuery,
  useFindUserByIdLazyQuery,
  useRejectBookingMutation,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Button, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import JourneyCardHeader from "@/app/components/JourneyCard/JourneyCardHeader";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";

const AcceptPage = ({
  params: {
    parametres: [bookingId, driverId],
  },
}: {
  params: { parametres: Array<string> };
}) => {
  const router = useRouter();
  const { getUser: userId } = useContext(AuthContext);
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

  if (
    bookingLoading ||
    userLoading ||
    acceptBookingLoading ||
    rejectBookingLoading
  ) {
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
    <div className="flex flex-col gap-8 items-center justify-center">
      <h2>{passengerFirstname} souhaite réserver votre trajet !</h2>
      <div className="booking_infos flex flex-col items-center text-center">
        <div className="flex flex-col gap-3 shadow-md py-6 px-10 rounded-lg">
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
      </div>
      {isAccepted === undefined ? (
        <div className="flex flex-col gap-4 items-center">
          <Button onClick={handleAccept}>Accepter</Button>
          <Button onClick={handleReject}>Refuser</Button>
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
