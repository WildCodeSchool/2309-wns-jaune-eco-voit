"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  useCreateRateMutation,
  useFindBookingByIdLazyQuery,
  useFindUserByIdLazyQuery,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Button, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import JourneyCardHeader from "@/app/components/JourneyCard/JourneyCardHeader";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";

const RatingPage = ({
  params: {
    parametres: [bookingId, driverId],
  },
}: {
  params: { parametres: Array<string> };
}) => {
  const router = useRouter();

  const [bookingRate, setBookingRate] = useState("5");

  const [
    findBookingById,
    { data: bookingDatas, error: bookingError, loading: bookingLoading },
  ] = useFindBookingByIdLazyQuery();

  const [
    findUserById,
    { data: userDatas, error: userError, loading: userLoading },
  ] = useFindUserByIdLazyQuery();

  useEffect(() => {
    if (bookingId && driverId) {
      findBookingById({ variables: { findBookingById: bookingId } });
      findUserById({ variables: { findUserById: driverId } });
    }
  }, [bookingId, driverId, findBookingById, findUserById]);

  const [
    rateBooking,
    { error: rateBookingError, loading: rateBookingLoading },
  ] = useCreateRateMutation({
    onCompleted: () => {
      router.push(routes["home"].pathname);
    },
  });

  const handleRateBooking = () => {
    if (!bookingRate || !driverId || !bookingId) return;
    rateBooking({
      variables: {
        data: {
          booking: { id: bookingId },
          userRated: { id: driverId },
          rate: bookingRate,
        },
      },
    });
  };

  const { getUser: userId } = useContext(AuthContext);

  useEffect(() => {
    (rateBookingError || userError || bookingError) &&
      router.push(`${routes["error"].pathname}`);
  }, [rateBookingError, userError, bookingError, router]);

  if (!bookingDatas || !userDatas) {
    return null;
  }

  if (bookingLoading || userLoading || rateBookingLoading) {
    return <CircularLoading />;
  }

  const {
    findBookingById: {
      journey: { departure_time, origin, destination },
      user: { id: passengerId },
      status: bookingStatus,
    },
  } = bookingDatas;

  const {
    findUserById: { firstname, profilePicture },
  } = userDatas;

  if (passengerId !== userId) {
    return (
      <div className="flex items-center justify-center">
        Vous n&apos;êtes pas autorisé à noter ce booking
      </div>
    );
  }

  if (bookingStatus !== "DONE") {
    return (
      <div className="flex items-center justify-center">
        Ce trajet ne peut pas etre noté
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <h2>Détails du trajet</h2>
      <div className="booking_infos flex flex-col items-center text-center">
        <div className="flex flex-col gap-3 shadow-md py-6 px-10 rounded-lg">
          <AvatarJourney
            firstname={firstname}
            profilePicture={profilePicture ?? undefined}
          />
          <JourneyCardHeader
            departureTime={departure_time}
            origin={origin}
            destination={destination}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h3>Évaluez le conducteur</h3>
        <Rating
          value={+bookingRate}
          onChange={(_, newValue) =>
            newValue && setBookingRate(newValue?.toString())
          }
          defaultValue={0}
          precision={1}
        />
        <Button onClick={handleRateBooking}>Noter</Button>
      </div>
    </div>
  );
};

export default RatingPage;
