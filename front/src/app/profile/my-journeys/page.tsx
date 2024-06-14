"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  useListBookingsByUserLazyQuery,
  useListJourneysByUserLazyQuery,
  useCancelBookingMutation,
  useUpdateJourneyStatusMutation,
} from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { TabList, TabPanel } from "@mui/lab";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { routes } from "@/app/lib/routes";
import { useRouter } from "next/navigation";
import MyJourneysTab from "@/app/components/myJourneys/MyJourneysTab";
import MyBookingsTab from "@/app/components/myBookings/MyBookings";

export default function MyJourneys() {
  const router = useRouter();

  const { getUser: userId } = useContext(AuthContext);

  const [tabDisplayed, setTabDisplayed] = useState<"JOURNEYS" | "BOOKINGS">(
    "JOURNEYS"
  );

  const [
    getUserBookings,
    { data: bookingData, loading: bookingLoading, error: bookingError },
  ] = useListBookingsByUserLazyQuery({ fetchPolicy: "network-only" }); // Lazy Query permet de créer une fonction quz l'on appelle quand on le veux

  const [
    getUserJourneys,
    { data: journeysData, loading: journeyLoading, error: journeyError },
  ] = useListJourneysByUserLazyQuery({ fetchPolicy: "network-only" });

  const [
    cancelBooking,
    { error: cancelBookingError, loading: cancelBookingLoading },
  ] = useCancelBookingMutation({
    fetchPolicy: "network-only",
  });

  const [
    updateJourneyStatus,
    { error: updateJourneyError, loading: updateJourneyStatusLoading },
  ] = useUpdateJourneyStatusMutation();

  const handleCancelJourney = (journeyId: string) => {
    updateJourneyStatus({
      variables: {
        data: { id: journeyId, status: "CANCELLED" },
      },
      onCompleted: () => {
        if (userId) {
          getUserJourneys({ variables: { userId } });
        }
      },
    });
  };

  const handleCancelBooking = (bookingIdToDelete: string) => {
    cancelBooking({
      variables: { cancelBookingId: bookingIdToDelete },
      onCompleted: () => {
        if (userId) {
          getUserBookings({
            variables: { userId },
            fetchPolicy: "network-only",
          });
        }
      },
    });
  };

  useEffect(() => {
    if (userId) {
      getUserBookings({
        variables: { userId },
      });
      getUserJourneys({
        variables: { userId },
      });
    }
  }, [getUserBookings, getUserJourneys, userId]);

  useEffect(() => {
    if (
      bookingError ||
      journeyError ||
      updateJourneyError ||
      cancelBookingError
    ) {
      router.push(`${routes["error"].pathname}`);
    }
  }, [
    bookingError,
    journeyError,
    updateJourneyError,
    cancelBookingError,
    router,
  ]);

  if (bookingLoading || journeyLoading) {
    return <CircularLoading />;
  }

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: "JOURNEYS" | "BOOKINGS"
  ) => {
    setTabDisplayed(newValue);
  };

  return (
    <div>
      <TabContext value={tabDisplayed}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Mes trajets" value="JOURNEYS" />
            <Tab label="Mes réservations" value="BOOKINGS" />
          </TabList>
        </Box>

        <MyJourneysTab
          journeys={journeysData}
          onCancelJourney={handleCancelJourney}
          isLoading={updateJourneyStatusLoading}
        />

        <MyBookingsTab
          bookings={bookingData}
          onCancelBooking={handleCancelBooking}
          isLoading={cancelBookingLoading}
        />
      </TabContext>
    </div>
  );
}
