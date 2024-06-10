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
import { useContext, useState } from "react";
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
    return <CircularProgress />;
  }

  return (
    <Stack className="h-full w-10/12" alignSelf={"center"}>
      {journeyError && <div>Error: {journeyError.message}</div>}
      {journeyData && (
        <Stack direction={"column"} justifyContent={"start"} height={"100vh"}>
          <Stack height={"25vh"} justifyContent={"center"}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              height={"10vh"}
            >
              {dayjs(journeyData?.findJourneyById.departure_time).format(
                "dddd D MMMM YYYY"
              )}
            </Typography>
          </Stack>

          <Grid container>
            <Grid item direction={"column"} xs={12} md={6} spacing={20}>
              <Divider />
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                sx={{ my: 4 }}
              >
                <Typography variant="h6" component="p">
                  Prix total pour 1 passager
                </Typography>
                <Typography variant="h6" component="p">
                  {journeyData?.findJourneyById.totalPrice} €
                </Typography>
              </Stack>
              <Divider sx={{ marginBottom: 4 }} />
              <AvatarJourney
                firstname={journeyData.findJourneyById.user.firstname}
                rating={2}
                profilePicture={
                  journeyData.findJourneyById.user.profilePicture!
                }
              />
              <Stack direction={"row"} spacing={3} marginY={8}>
                <VerifiedUserOutlinedIcon />
                <p className="text-xl text-dark60">Profil Vérifié</p>
              </Stack>
              <Stack direction={"row"} spacing={3} marginY={4}>
                <CalendarMonthOutlinedIcon color="primary" />
                <p className="text-xl text-dark60">
                  Annule rarement ses trajets
                </p>
              </Stack>

              <Divider sx={{ marginY: 8 }} />

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
              md={6}
              sx={{
                marginY: {
                  xs: 8,
                  md: 0,
                },
                minHeight: "400px",
              }}
            >
              <h6
                className={
                  "text-center text-3xl mb-10 font-bold text-primary-500"
                }
              >
                Détail du trajet
              </h6>
              <JourneyTimeline
                departureTime={journeyData.findJourneyById.departure_time}
                arrivalTime={journeyData.findJourneyById.arrival_time}
                origin={journeyData.findJourneyById.origin}
                destination={journeyData.findJourneyById.destination}
              />
            </Grid>
          </Grid>

          {userId && isUserAllowedToAccessMessage() && (
            <JourneyMessages userId={userId} journeyId={journeyId} />
          )}
        </Stack>
      )}
    </Stack>
  );
}
