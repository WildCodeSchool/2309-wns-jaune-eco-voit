"use client";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { useFindJourneyByIdQuery, useFindUserByIdQuery } from "@/types/graphql";
import {
  Stack,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import JourneyTimeline from "@/app/components/JourneyCard/JourneyTimeline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import JourneyMessages from "@/app/components/JourneyMessages/JourneyMessages";
import BookJourneyButton from "@/app/components/Buttons/BookJourneyButton";

export default function Page({ params }: { params: { id: string } }) {
  const { id: journeyId } = params;

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

  const { data: userData } = useFindUserByIdQuery({
    variables: {
      findUserById: userContextId || "",
    },
  });

  if (!journeyData || journeyError) {
    //TODO renvoyer vers la page d'erreur
    return <div>Quelque chose s&apos;est mal passé</div>;
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
      totalPrice,
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

  if (journeyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Stack className="h-full w-10/12 mx-auto">
      <Stack direction="column" alignItems="center" spacing={4}>
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
                {totalPrice} €
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
            <Divider />
            <AvatarJourney
              firstname={driver.firstname}
              rating={driver.averageRate}
              profilePicture={driver.profilePicture!}
            />
            <Divider />
            {driver.id !== userContextId && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<QuestionAnswerIcon />}
                sx={{ borderRadius: "20px" }}
                size="large"
              >
                Contacter {driver.firstname}
              </Button>
            )}
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
            <BookJourneyButton journey={journeyData.findJourneyById} />
          </Grid>
        </Grid>

        {userContextId && isUserAllowedToAccessMessage() && (
          <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Grid item xs={12}>
              <JourneyMessages userId={userContextId} journeyId={journeyId} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}
