import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import { tooLateToBook } from "@/app/utils/date";
import {
  CreateBookingInput,
  JourneyEntity,
  useCreateBookingMutation,
} from "@/types/graphql";

type BookJourneyButtonProps = {
  journey: JourneyEntity;
  nbPassenger: number;
};

const BookJourneyButton = ({
  journey,
  nbPassenger,
}: BookJourneyButtonProps) => {
  const { userId } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [createBookingMutation, { data: newBooking }] =
    useCreateBookingMutation();

  const router = useRouter();

  const bookJourney = () => {
    setErrorMessage("");

    const booking: CreateBookingInput = {
      user: { id: userId! },
      journey: { id: journey.id },
      status: journey.status,
      nbPassenger,
    };

    createBookingMutation({
      variables: { data: booking },
      onCompleted: (res) => {
        if (journey.automaticAccept) {
          setTimeout(() => {
            router.push(`/payment/waiting/${res.createBooking.id}`);
          }, 100);
        } else {
          setTimeout(() => {
            router.push(`/booking/${res.createBooking.id}`);
          }, 100);
        }
      },
      onError: ({ message }) => {
        setErrorMessage(message);
      },
    });
  };

  return (
    <>
      {userId !== journey.user.id && journey.availableSeats > 0 ? (
        userId ? (
          <div className="flex justify-center">
            <Button
              variant="contained"
              size="large"
              onClick={bookJourney}
              disabled={tooLateToBook(journey.departureTime)}
            >
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
