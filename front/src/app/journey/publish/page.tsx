"use client";
import { useContext, useState } from "react";
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

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

const PublishJourney = () => {
  const { getUser: userId } = useContext(AuthContext);
  const router = useRouter();

  const [
    createJourney,
    { data: createJourneyData, error: createJourneyError },
  ] = useCreateJourneyMutation();

  const [journeyData, setJourneyData] = useState<JourneyData>({
    origin: "",
    destination: "",
    departure_date: dayjs(),
    price: 0,
    automaticAccept: true,
    availableSeats: 1,
  });

  const handleOnValidateForm = () => {
    if (
      !journeyData.origin ||
      !journeyData.destination ||
      journeyData.departure_date < dayjs() ||
      journeyData.price === 0 ||
      journeyData.availableSeats === 0 ||
      !userId
    ) {
      return;
    }

    const journey = {
      departure_time: journeyData.departure_date.toISOString(),
      arrival_time: journeyData.departure_date.add(2, "hour").toISOString(),
      origin: journeyData.origin,
      destination: journeyData.destination,
      price: journeyData.price,
      availableSeats: journeyData.availableSeats,
      automaticAccept: journeyData.automaticAccept,
      user: { id: userId },
    };

    createJourney({
      variables: { data: journey },
      onError: (err) => console.error("error", err),
      onCompleted: (res) =>
        router.push(`${routes.journey.pathname}/${res?.createJourney.id}`),
    });
  };

  return (
    <UpdateOrCreateJourney
      setJourneyData={setJourneyData}
      journeyData={journeyData}
      errorMessage={
        createJourneyError ? "Impossible de créer le trajet!" : undefined
      }
      handleOnValidateForm={handleOnValidateForm}
    />
  );
};

export default PublishJourney;
