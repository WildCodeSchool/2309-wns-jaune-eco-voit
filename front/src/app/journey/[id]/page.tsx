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
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUser";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import JourneyMessages from "@/app/components/JourneyMessages/JourneyMessages";

export default function Page({ params }: { params: { id: string } }) {
  const { id: journeyId } = params;

  const { getUserId: userId } = useContext(AuthContext);

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
    const journey = journeyData?.findJourneyById;
    const userConnected = userData?.findUserById;

    const isDriver = journey?.user.id === userId;

    const journeyBookingIds = new Set(
      journey?.bookings?.map((booking) => booking.id)
    );
    const isPassenger = userConnected?.bookings?.some((booking) =>
      journeyBookingIds.has(booking.id)
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
      {journeyError && <div>Error: {journeyError.message}</div>}
      {journeyData && (
        <Stack direction="column" alignItems="center" spacing={4}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{ height: "10vh", my: 4 }}
          >
            {dayjs(journeyData?.findJourneyById.departure_time).format(
              "dddd D MMMM YYYY"
            )}
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
                  Prix total pour 1 passager
                </Typography>
                <Typography variant="h6" component="p">
                  {journeyData?.findJourneyById.totalPrice} €
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
                  {journeyData?.findJourneyById.availableSeats}
                </Typography>
              </Stack>
              <Divider />
              <AvatarJourney
                firstname={journeyData.findJourneyById.user.firstname}
                rating={2}
                profilePicture={
                  journeyData.findJourneyById.user.profilePicture!
                }
              />
              {/* <Stack direction="row" spacing={3} marginY={8}>
                <VerifiedUserOutlinedIcon />
                <Typography variant="body1" className="text-dark60">
                  Profil Vérifié
                </Typography>
              </Stack>
              <Stack direction="row" spacing={3} marginY={4}>
                <CalendarMonthOutlinedIcon color="primary" />
                <Typography variant="body1" className="text-dark60">
                  Annule rarement ses trajets
                </Typography>
              </Stack> */}
              <Divider />
              <Button
                variant="contained"
                fullWidth
                startIcon={<QuestionAnswerIcon />}
                sx={{ borderRadius: "20px" }}
                size="large"
              >
                Contacter {journeyData.findJourneyById.user.firstname}
              </Button>
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
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                Détail du trajet
              </Typography>
              <JourneyTimeline
                departureTime={journeyData.findJourneyById.departure_time}
                arrivalTime={journeyData.findJourneyById.arrival_time}
                origin={journeyData.findJourneyById.origin}
                destination={journeyData.findJourneyById.destination}
              />
            </Grid>
          </Grid>

          {userId && isUserAllowedToAccessMessage() && (
            <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <JourneyMessages userId={userId} journeyId={journeyId} />
              </Grid>
            </Grid>
          )}
        </Stack>
      )}
    </Stack>
  );
}
