"use client";
import { useCallback, useContext, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AuthContext } from "@/context/authContext";
import { useCreateJourneyMutation } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import UpdateOrCreateJourney, {
  JourneyData,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { debounce } from "@mui/material";
import { ResponseError, ResponseGetItinerary } from "@/app/api/itinerary/route";
import { getItinerary } from "@/app/utils/getItinerary";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

const PublishJourney = () => {
  const { getUser: userId } = useContext(AuthContext);
  const router = useRouter();

  const [error, setError] = useState(false);

  const [
    createJourney,
    { data: createJourneyData, error: createJourneyError },
  ] = useCreateJourneyMutation();

  const [journeyData, setJourneyData] = useState<JourneyData>({
    origin: "",
    originCoordinates: "",
    destination: "",
    destinationCoordinates: "",
    departureTime: dayjs(),
    price: 0,
    automaticAccept: true,
    availableSeats: 1,
  });

  const handleOnValidateForm = async () => {
    const {
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      price,
      departureTime,
      automaticAccept,
      availableSeats,
    } = journeyData;

    if (
      !origin ||
      !destination ||
      departureTime < dayjs() ||
      price === 0 ||
      availableSeats === 0 ||
      !userId
    ) {
      return;
      // TODO gerer erreur
    }

    const { duration }: ResponseGetItinerary = await getItinerary(
      originCoordinates,
      destinationCoordinates,
      setError
    );

    const arrivalTime = departureTime.add(duration, "second");

    console.log(arrivalTime);

    const journey = {
      departureTime: departureTime.toISOString(),
      // A ajouter quand l'API IGN serai ok
      // arrivalTime: arrivalTime.toISOString(),
      arrivalTime: departureTime.add(2, "hour").toISOString(),
      origin: origin,
      originCoordinates: originCoordinates,
      destination: destination,
      destinationCoordinates: destinationCoordinates,
      price: price,
      availableSeats: availableSeats,
      automaticAccept: automaticAccept,
      user: { id: userId },
    };

    createJourney({
      variables: { data: journey },
      onError: (err) => setError(true),
      onCompleted: (res) =>
        router.push(`${routes.journey.pathname}/${res?.createJourney.id}`),
    });
  };

  return (
    <UpdateOrCreateJourney
      setJourneyData={setJourneyData}
      journeyData={journeyData}
      errorMessage={error ? "Impossible de créer le trajet!" : undefined}
      handleOnValidateForm={handleOnValidateForm}
    />
  );
};

export default PublishJourney;
