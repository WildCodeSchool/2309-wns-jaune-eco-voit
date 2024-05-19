"use client";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { useFindJourneyByIdQuery } from "@/types/graphql";

import { Stack, Typography, Grid, Divider, Button } from "@mui/material";

import AvatarJourney from "@/app/components/Avatar/AvatarJouney";
import JourneyTimeline from "@/app/components/JourneyCard/JourneyTimeline";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUser";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export default function Page({ params }: { params: { id: string } }) {
  const { data, loading, error } = useFindJourneyByIdQuery({
    variables: {
      findJourneyById: params.id,
    },
  });

  return (
    <Stack className="h-full w-10/12" alignSelf={"center"}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <Stack direction={"column"} justifyContent={"start"} height={"100vh"}>
          <Stack height={"25vh"} justifyContent={"center"}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              height={"10vh"}
            >
              {dayjs(data?.findJourneyById.departure_time).format(
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
                  {data?.findJourneyById.totalPrice} €
                </Typography>
              </Stack>
              <Divider sx={{ marginBottom: 4 }} />
              <AvatarJourney
                firstname={data.findJourneyById.user.firstname}
                rating={2}
                profilePicture={data.findJourneyById.user.profilPicture!}
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
                Contacter {data.findJourneyById.user.firstname}
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
                departureTime={data.findJourneyById.departure_time}
                arrivalTime={data.findJourneyById.arrival_time}
                origin={data.findJourneyById.origin}
                destination={data.findJourneyById.destination}
              />
            </Grid>
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}
