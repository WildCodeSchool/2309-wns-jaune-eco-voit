"use client";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

import { Stack, Typography, Grid, Divider, TextField } from "@mui/material";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import JourneyTimeline from "@/app/components/JourneyCard/JourneyTimeline";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/authContext";
import JourneyMessages from "@/app/components/JourneyMessages/JourneyMessages";
import BookJourneyButton from "@/app/components/Buttons/BookJourneyButton";
import { routes } from "@/app/lib/routes";
import { useRouter } from "next/navigation";
import { Grade } from "@/types/user";
import { tooLateToBook } from "@/app/utils/date";
import {
  JourneyEntity,
  useFindJourneyByIdQuery,
  useFindUserByIdQuery,
} from "@/types/graphql";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";

export default function JourneyPage({ params }: { params: { id: string } }) {
  const { id: journeyId } = params;
  const router = useRouter();

  const { userId } = useContext(AuthContext);
  const [nbPassenger, setNbPassenger] = useState(1);

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
      findUserById: userId || "",
    },
  });

  const isUserAllowedToAccessMessage = () => {
    const isDriver = driver.id === userId;
    const journeyBookingIds = bookings.map(({ id }) => id);

    const isPassenger = userData?.findUserById.bookings?.some(({ id }) =>
      journeyBookingIds.includes(id)
    );

    return isDriver || isPassenger;
  };

  const maxNbPassenger = (nb: number) =>
    Math.max(1, Math.min(nb, availableSeats));

  if (journeyError) {
    router.push(`${routes["error"].pathname}`);
  }

  if (journeyLoading) return <CircularLoading />;

  if (!journeyData) {
    return null;
  }

  const {
    findJourneyById: {
      user: driver,
      bookings,
      departureTime,
      arrivalTime,
      origin,
      destination,
      availableSeats,
      price,
    },
  } = journeyData;

  return (
    <Stack className="h-full w-10/12 mx-auto">
      <Stack direction="column" alignItems="center" spacing={4} marginTop={10}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ height: "10vh", my: 4 }}
        >
          {dayjs(departureTime).format("dddd D MMMM YYYY")}
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
            {userId &&
            driver.id !== userId &&
            availableSeats > 0 &&
            !tooLateToBook(departureTime) ? (
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
                  value={nbPassenger}
                  onChange={(e) =>
                    setNbPassenger(maxNbPassenger(parseInt(e.target.value)))
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
                {price * nbPassenger} €
              </Typography>
            </Stack>
            <Divider />
            <AvatarJourney
              id={driver.id}
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
              departureTime={departureTime}
              arrivalTime={arrivalTime}
              origin={origin}
              destination={destination}
            />
            <BookJourneyButton
              journey={journeyData.findJourneyById as JourneyEntity}
              nbPassenger={nbPassenger}
            />
          </Grid>
        </Grid>
        {userId && isUserAllowedToAccessMessage() && (
          <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Grid container spacing={2} alignItems="center" sx={{ marginY: 4 }}>
              <JourneyMessages userId={userId} journeyId={journeyId} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}
