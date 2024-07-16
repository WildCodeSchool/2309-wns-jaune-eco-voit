import { JourneyEntity, useCreateBookingMutation } from "@/types/graphql";
import { Button } from "@mui/material";

import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { CreateBookingInput } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";

const BookJourneyButton = ({ journey, passenger }: any) => {
  const { getUser: userId } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [
    createBookingMutation,
    {
      data: createBookingSuccess,
      loading: createBookingLoading,
      error: createBookingError,
    },
  ] = useCreateBookingMutation();

  const router = useRouter();
  const BookJourney = () => {
    setErrorMessage("");
    const booking: CreateBookingInput = {
      user: { id: userId! },
      journey: { id: journey.id },
      status: journey.status,
      nbPassenger: passenger,
    };
    createBookingMutation({
      variables: { data: booking },
      onCompleted: (res) => {
        setTimeout(() => {
          router.push(`/booking/${res.createBooking.id}`);
        }, 100);
      },
      onError: (err) => {
        console.log("err", err.message);
        setErrorMessage(err.message);
      },
    });
  };

  return (
    <>
      {userId ? (
        <div className="flex justify-center">
          <Button variant="contained" size="large" onClick={BookJourney}>
            Réserver
          </Button>
          <div>{errorMessage}</div>
        </div>
      ) : (
        <div className="text-center">
          Connectez-vous pour pouvoir réserver ce trajet.
        </div>
      )}
    </>
  );
};
export default BookJourneyButton;
