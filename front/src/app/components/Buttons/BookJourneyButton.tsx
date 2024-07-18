import { JourneyEntity, useCreateBookingMutation } from "@/types/graphql";
import { Button } from "@mui/material";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { CreateBookingInput } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";

type BookJourneyButtonProps = {
  journey: JourneyEntity;
  passenger: number;
};
const BookJourneyButton = ({ journey, passenger }: BookJourneyButtonProps) => {
  const { getUser: userId } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [createBookingMutation] = useCreateBookingMutation();

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
      {userId !== journey.user.id && journey.availableSeats > 0 ? (
        userId ? (
          <div className="flex justify-center">
            <Button variant="contained" size="large" onClick={BookJourney}>
              Réserver
            </Button>
            <div>{errorMessage}</div>
          </div>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() =>
              router.push(
                `${routes["login"].pathname}?requestedURL=${routes["journey"].pathname}/${journey.id}`
              )
            }
          >
            Connectez-vous pour réserver
          </Button>
        )
      ) : null}
    </>
  );
};
export default BookJourneyButton;
