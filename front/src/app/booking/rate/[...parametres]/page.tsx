"use client";
import React, { useContext, useState } from "react";
import {
  useCreateRateMutation,
  useFindBookingByIdQuery,
  useFindUserByIdQuery,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Avatar, Button, CircularProgress, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import JourneyCardHeader from "@/app/components/JourneyCard/JourneyCardHeader";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";

const RatingPage = ({
  params: {
    parametres: [bookingId, driverId],
  },
}: {
  params: { parametres: Array<string> };
}) => {
  const router = useRouter();
  const [bookingRate, setBookingRate] = useState<string>("5");
  const {
    data: bookingDatas,
    error: bookingError,
    loading: bookingLoading,
  } = useFindBookingByIdQuery({ variables: { findBookingById: bookingId } });
  const {
    data: userDatas,
    error: userError,
    loading: userLoading,
  } = useFindUserByIdQuery({ variables: { findUserById: driverId } });

  const [
    rateBooking,
    {
      data: rateBookingData,
      error: rateBookingError,
      loading: rateBookingLoading,
    },
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

  if (bookingLoading || userLoading || rateBookingLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!bookingDatas || !userDatas) {
    return <div>Désolé, quelque chose s&apos;est mal passé</div>;
  }

  const {
    findBookingById: {
      journey: { departure_time, origin, destination },
    },
  } = bookingDatas;

  const {
    findUserById: { firstname, profilePicture },
  } = userDatas;

  if (bookingDatas?.findBookingById.user.id !== userId) {
    return (
      <div className="flex items-center justify-center">
        You are not allowed to rate this booking
      </div>
    );
  }

  if (bookingDatas?.findBookingById.status !== "DONE") {
    return (
      <div className="flex items-center justify-center">
        Ce trajet ne peut pas etre noté
      </div>
    );
  }

  console.log("bookingDatas", bookingDatas);
  console.log("userDatas", userDatas);
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <h2>Détails du trajet</h2>
      <div className="booking_infos flex flex-col items-center text-center">
        <div className="flex flex-col gap-3 shadow-md py-6 px-10 rounded-lg">
          <AvatarJourney
            firstname={firstname}
            profilePicture={
              profilePicture ??
              "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
            }
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
          onChange={(e, newValue) =>
            setBookingRate(newValue?.toString() ?? "1")
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
