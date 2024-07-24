"use client";
import { useContext, useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";
import UpdateOrCreateJourney, {
  JourneyData,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { ResponseError, ResponseGetItinerary } from "@/app/api/itinerary/route";
import { getItinerary } from "@/app/utils/getItinerary";
import { useCreateJourneyMutation } from "@/types/graphql";

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
    departureTime: dayjs().add(2, "hour"),
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
      console.log(
        "error",
        origin,
        destination,
        departureTime,
        price,
        availableSeats,
        userId
      );
      return;
      // TODO gerer erreur
    }

    const response: ResponseGetItinerary | undefined = await getItinerary(
      originCoordinates,
      destinationCoordinates,
      setError
    );

    if (!response?.duration) {
      setError(true);
      return;
    }

    const { duration } = response;

    const arrivalTime = departureTime.add(duration, "second");

    const journey = {
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      price,
      availableSeats,
      automaticAccept,
      user: { id: userId },
    };

    createJourney({
      variables: { data: journey },
      onError: () => setError(true),
      onCompleted: (res) =>
        router.push(`${routes.journey.pathname}/${res?.createJourney.id}`),
    });
  };

  return (
    <UpdateOrCreateJourney
      setJourneyData={setJourneyData}
      journeyData={journeyData}
      handleOnValidateForm={handleOnValidateForm}
    />
  );
};

export default PublishJourney;
