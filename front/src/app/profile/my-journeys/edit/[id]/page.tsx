"use client";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import {
  UpdateJourneyInput,
  useFindJourneyByIdQuery,
  useUpdateJourneyMutation,
} from "@/types/graphql";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { routes } from "@/app/lib/routes";
import { useRouter } from "next/navigation";
import UpdateOrCreateJourney, {
  JourneyData,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";

export default function Page({ params }: { params: { id: string } }) {
  const { id: journeyId } = params;
  const router = useRouter();

  const { getUser: userContextId } = useContext(AuthContext);

  const {
    data: journeyData,
    loading: journeyLoading,
    error: journeyError,
  } = useFindJourneyByIdQuery({
    variables: {
      findJourneyById: journeyId,
    },
  });

  const [updateJourney, { error: updateJourneyError }] =
    useUpdateJourneyMutation();

  const [updatedJourneyData, setUpdatedJourneyData] = useState<JourneyData>({
    origin: "",
    originCoordonates: "",
    destination: "",
    destinationCoordonates: "",
    departure_date: dayjs(),
    price: 0,
    automaticAccept: true,
    availableSeats: 1,
  });

  useEffect(() => {
    if (journeyData?.findJourneyById) {
      const {
        origin,
        destination,
        departure_time,
        price,
        automaticAccept,
        availableSeats,
        originCoordonates,
        destinationCoordonates,
      } = journeyData.findJourneyById;
      setUpdatedJourneyData({
        origin,
        destination,
        departure_date: dayjs(departure_time),
        price,
        automaticAccept,
        availableSeats,
        originCoordonates,
        destinationCoordonates,
      });
    }
  }, [journeyData?.findJourneyById]);

  if (journeyError) {
    router.push(`${routes["error"].pathname}`);
  }

  if (journeyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!journeyData) {
    return null;
  }

  const {
    user: { id: driverId },
    bookings,
  } = journeyData.findJourneyById;

  const {
    origin,
    destination,
    departure_date,
    price,
    availableSeats,
    automaticAccept,
  } = updatedJourneyData;

  const handleOnValidateForm = () => {
    if (
      !origin ||
      !destination ||
      departure_date < dayjs() ||
      price === 0 ||
      availableSeats === 0
    ) {
      //TODO GERER ERREUR
      return;
    }

    const updateJourneyInput: UpdateJourneyInput = {
      id: journeyId,
      departure_time: departure_date.toISOString(),
      arrival_time: departure_date.add(2, "hour").toISOString(),
      origin,
      destination,
      price,
      availableSeats,
      automaticAccept,
    };

    updateJourney({
      variables: { data: updateJourneyInput },
      onCompleted: () => {
        router.push(`${routes.journeysUser.pathname}`);
      },
      onError: (err) => console.error("error", err),
    });
  };

  return (
    <Stack className="h-full w-10/12 mx-auto">
      <Stack direction="column" alignItems="center" spacing={4}>
        {userContextId !== driverId ? (
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{ height: "10vh", my: 4 }}
          >
            Vous n&apos;avez pas le droit de modifier ce trajet, il n&apos;est
            pas le votre !
          </Typography>
        ) : bookings.length >= 1 ? (
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{ height: "10vh", my: 4 }}
          >
            Ayant déjà des réservations sur ce trajet, vous ne pouvez pas le
            modifier. Annulez le si vous avez un imprévu.
          </Typography>
        ) : (
          <UpdateOrCreateJourney
            journeyData={updatedJourneyData}
            errorMessage={
              updateJourneyError
                ? "Votre trajet n&apos;a pas été modifié"
                : undefined
            }
            setJourneyData={setUpdatedJourneyData}
            handleOnValidateForm={handleOnValidateForm}
          />
        )}
      </Stack>
    </Stack>
  );
}
