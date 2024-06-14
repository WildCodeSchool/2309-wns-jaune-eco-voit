"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  useListBookingsByUserLazyQuery,
  useListJourneysByUserLazyQuery,
  useListBookingsByUserQuery,
  useCancelBookingMutation,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { TabList, TabPanel } from "@mui/lab";
import dayjs from "dayjs";

export default function MyJourneys() {
  const { getUser: userId } = useContext(AuthContext);

  const [value, setValue] = useState("1");
  const [
    getUserBookings,
    { data: bookingData, loading: bookingLoading, error: bookingError },
  ] = useListBookingsByUserLazyQuery({ fetchPolicy: "network-only" }); // Lazy Query permet de créer une fonction quz l'on appelle quand on le veux
  const [
    getUserJourneys,
    { data: journeyData, loading: journeyLoading, error: journeyError },
  ] = useListJourneysByUserLazyQuery({ fetchPolicy: "network-only" });

  const [cancelBooking] = useCancelBookingMutation({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (userId) {
      getUserBookings({
        variables: { userId: userId },
      });
      getUserJourneys({
        variables: { userId: userId },
      });
    }
  }, [getUserBookings, getUserJourneys, userId]);

  if (!userId || bookingLoading || journeyLoading) {
    return <div>Loading ...</div>;
  }

  if (bookingError || journeyError) {
    return <div>Error</div>;
  }

  const formattedTime = (time: Date) => {
    return dayjs(time).format("HH[h]mm");
  };

  const formattedDate = (day: Date) => {
    return dayjs(day).locale("fr").format("dddd D MMMM");
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleCancelBooking = (bookingIdToDelete: string) => {
    cancelBooking({
      variables: { cancelBookingId: bookingIdToDelete },
      onCompleted: () => {
        getUserBookings({
          variables: { userId: userId },
          fetchPolicy: "network-only",
        });
      },
    });
  };

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Mes trajets" value="1" />
            <Tab label="Mes réservations" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {journeyData?.listJourneysByUser.map((journey, index) => (
            <Card
              key={index}
              className="flex items-center mb-4 p-4 m-auto  w-1/2"
            >
              <Avatar
                alt="profile picture"
                src={journey?.user?.profilePicture ?? ""}
              />

              <CardContent className="flex-grow ">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="h6"
                    component="h6"
                    className="font-semibold"
                  >
                    {journey.user.firstname}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-sm"
                  >
                    {formattedDate(journey.departure_time)} <br />
                    Départ : {formattedTime(journey.departure_time)}
                  </Typography>
                  <div className="flex flex-col items-center justify-evenly gap-2  m-2">
                    <Button
                      className=" "
                      onClick={() => {
                        console.log("edit");
                      }}
                    >
                      Modifier
                    </Button>{" "}
                    {/* TODO faire la fonction de modification des journeys */}
                    <Button
                      className=""
                      onClick={() => {
                        console.log("cancel");
                      }}
                    >
                      Annuler
                    </Button>{" "}
                    {/* TODO faire la fonction de suppression des journeyx */}
                  </div>
                </div>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  De {journey.origin} à {journey.destination}
                </Typography>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  Siége dispobible : {journey.availableSeats}
                </Typography>
                <Typography>Prix : {journey.totalPrice}€</Typography>
              </CardContent>
            </Card>
          ))}
        </TabPanel>
        <TabPanel value="2">
          {bookingData?.listBookingsByUser.map((booking, index) => (
            <Card
              key={index}
              className={`flex justify-between items-center mb-4 p-4 m-auto h-full w-1/2 
              `}
            >
              <CardContent
                className={`flex-grow ${
                  booking.status !== "ACCEPTED" ? "opacity-50" : ""
                }`}
              >
                <Avatar
                  alt="profile picture"
                  src={booking?.journey?.user?.profilePicture ?? ""}
                />
                <div className="flex items-center justify-between">
                  <Typography
                    variant="h6"
                    component="h6"
                    className="font-semibold"
                  >
                    {booking?.journey?.user?.firstname}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-sm"
                  >
                    {formattedDate(booking?.journey?.departure_time)} <br />
                    Départ : {formattedTime(booking?.journey?.departure_time)}
                  </Typography>
                </div>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  De {booking.journey.origin} à {booking.journey.destination}
                </Typography>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  Siége disponible : {booking.journey.availableSeats}
                </Typography>
                <Typography>Prix : {booking.journey.totalPrice}€</Typography>
              </CardContent>
              <div className="flex flex-col gap-2 justify-between items-end h-full">
                <div className="status rounded-full bg-primary100 py-1 px-2 text-xs text-white w-fit">
                  {booking.status.toLocaleLowerCase()}
                </div>

                <Button
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={booking.status !== "ACCEPTED"}
                >
                  Annuler
                </Button>
              </div>
            </Card>
          ))}
        </TabPanel>
      </TabContext>
    </div>
  );
}
