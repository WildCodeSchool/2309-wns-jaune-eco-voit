"use client";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import {
  JourneyEntity,
  useFindJourneyByIdQuery,
  useFindUserByIdQuery,
} from "@/types/graphql";
import {
  Stack,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import JourneyTimeline from "@/app/components/JourneyCard/JourneyTimeline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import JourneyMessages from "@/app/components/JourneyMessages/JourneyMessages";
import BookJourneyButton from "@/app/components/Buttons/BookJourneyButton";
import { routes } from "@/app/lib/routes";
import { useRouter } from "next/navigation";
import { Grade } from "@/types/user";

export default function Page({ params }: { params: { id: string } }) {
  const { id: journeyId } = params;
  const router = useRouter();

  const { getUser: userContextId } = useContext(AuthContext);
  const [passengerNb, setPassengerNb] = useState(1);
  const {
    data: journeyData,
    loading: journeyLoading,
    error: journeyError,
  } = useFindJourneyByIdQuery({
    variables: {
      findJourneyById: journeyId,
    },
  });

  const { data: userData } = useFindUserByIdQuery({
    variables: {
      findUserById: userContextId || "",
    },
  });

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

  function maxPassengerNb(nb: number) {
    if (nb > 0) {
      return nb > availableSeats ? availableSeats : nb;
    } else {
      return 1;
    }
  }

  const {
    findJourneyById: {
      user: driver,
      bookings,
      departure_time,
      arrival_time,
      origin,
      destination,
      availableSeats,
      price,
    },
  } = journeyData;

  const isUserAllowedToAccessMessage = () => {
    const isDriver = driver.id === userContextId;

    const journeyBookingIds = bookings.map(({ id }) => id);

    const isPassenger = userData?.findUserById.bookings?.some(({ id }) =>
      journeyBookingIds.some((journeyBookingId) => journeyBookingId === id)
    );

    return isDriver || isPassenger;
  };

  return (
    <Stack className="h-full w-10/12 mx-auto">
      <Stack direction="column" alignItems="center" spacing={4} marginTop={10}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ height: "10vh", my: 4 }}
        >
          {dayjs(departure_time).format("dddd D MMMM YYYY")}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Divider />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ my: 4 }}
            >
              <Typography variant="h6" component="p">
                Tarif pour 1 passager
              </Typography>
              <Typography variant="h6" component="p">
                {price} €
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ my: 4 }}
            >
              <Typography variant="h6" component="p">
                Nombre de places disponibles
              </Typography>
              <Typography variant="h6" component="p">
                {availableSeats}
              </Typography>
            </Stack>
            {userContextId &&
            driver.id !== userContextId &&
            availableSeats > 0 ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ my: 4 }}
              >
                <Typography variant="h6" component="p">
                  Nombre de passager(s)
                </Typography>
                <TextField
                  id="outlined-number"
                  label="Nombre de passagers"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: 0, max: availableSeats }}
                  variant="outlined"
                  value={passengerNb}
                  onChange={(e) =>
                    setPassengerNb(maxPassengerNb(parseInt(e.target.value)))
                  }
                />
              </Stack>
            ) : null}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ my: 4 }}
            >
              <Typography variant="h6" component="p">
                Total
              </Typography>
              <Typography variant="h6" component="p">
                {price * passengerNb} €
              </Typography>
            </Stack>
            <Divider />
            <AvatarJourney
              firstname={driver.firstname}
              rating={driver.averageRate}
              profilePicture={driver.profilePicture!}
              grade={driver.grade as Grade}
            />
            <Divider />
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              marginY: {
                xs: 8,
                md: 0,
              },
              minHeight: "400px",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 4,
                fontSize: "1.8rem",
                color: "black",
              }}
            >
              Détail du trajet
            </Typography>
            <p className={"text-center  mb-10 font-bold text-primary-500"}>
              Nombre de places disponibles : {availableSeats}
            </p>
            <JourneyTimeline
              departureTime={departure_time}
              arrivalTime={arrival_time}
              origin={origin}
              destination={destination}
            />
            <BookJourneyButton
              journey={journeyData.findJourneyById as JourneyEntity}
              passenger={passengerNb}
            />
          </Grid>
        </Grid>

        {userContextId && isUserAllowedToAccessMessage() && (
          <Grid container spacing={2} alignItems="center" sx={{ marginY: 4 }}>
            <Grid item xs={12}>
              <JourneyMessages userId={userContextId} journeyId={journeyId} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}
