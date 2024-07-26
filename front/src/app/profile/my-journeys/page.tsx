"use client";
import { SyntheticEvent, useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context/authContext";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { TabList, TabPanel } from "@mui/lab";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { routes } from "@/app/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useListBookingsByUserLazyQuery,
  useListJourneysByUserLazyQuery,
} from "@/types/graphql";
import MyJourneyCard from "@/app/components/MyJourney/MyJourneyCard";
import MyBookingCard from "@/app/components/MyBooking/MyBookingCard";
import OnPendingTab from "@/app/components/onPending/OnPending";

export type MyJourneysTabs = "JOURNEYS" | "BOOKINGS" | "PENDING";

export default function MyJourneys() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");

  const router = useRouter();

  const { getUser: userId } = useContext(AuthContext);

  const [tabDisplayed, setTabDisplayed] = useState<MyJourneysTabs>("JOURNEYS");

  const [
    getUserBookings,
    {
      data: bookingData,
      loading: bookingLoading,
      error: bookingError,
      refetch: bookingRefetch,
    },
  ] = useListBookingsByUserLazyQuery({ fetchPolicy: "network-only" }); // Lazy Query permet de créer une fonction quz l'on appelle quand on le veux

  const [
    getUserJourneys,
    {
      data: journeysData,
      loading: journeyLoading,
      error: journeyError,
      refetch: journeysRefetch,
    },
  ] = useListJourneysByUserLazyQuery({ fetchPolicy: "network-only" });

  useEffect(() => {
    if (requestedTab) {
      setTabDisplayed(requestedTab as MyJourneysTabs);
    }
  }, [requestedTab, setTabDisplayed]);

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
    if (bookingError || journeyError) {
      router.push(`${routes["error"].pathname}`);
    }
  }, [bookingError, journeyError, router]);

  if (bookingLoading || journeyLoading) {
    return <CircularLoading />;
  }

  const handleChange = (
    event: SyntheticEvent,
    newValue: "JOURNEYS" | "BOOKINGS" | "PENDING"
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
            <Tab label="Mes trajets en attente" value="PENDING" />
          </TabList>
        </Box>

        <TabPanel
          value="JOURNEYS"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {journeysData?.listJourneysByUser &&
          journeysData.listJourneysByUser.length > 0 ? (
            [...journeysData.listJourneysByUser]
              .sort((a, b) => {
                if (a.status === "PLANNED" && b.status !== "PLANNED") return -1;
                if (b.status === "PLANNED" && a.status !== "PLANNED") return 1;
                return +new Date(a.departureTime) - +new Date(b.departureTime);
              })
              .map((journey) => (
                <MyJourneyCard
                  key={journey.id}
                  journey={journey}
                  onCompleteCancelJourney={() => {
                    if (userId) {
                      getUserJourneys({
                        variables: { userId },
                      });
                    }
                  }}
                  journeysRefetch={journeysRefetch}
                />
              ))
          ) : (
            <div>Vous n&apos;avez aucun trajet !</div>
          )}
        </TabPanel>

        <TabPanel
          value="BOOKINGS"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {bookingData?.listBookingsByUser.length ? (
            bookingData?.listBookingsByUser.length > 0 &&
            [...bookingData.listBookingsByUser]
              .sort((a, b) => {
                if (
                  (a.status === "ACCEPTED" ||
                    a.status === "PENDING" ||
                    a.status === "PAID") &&
                  b.status !== "ACCEPTED" &&
                  b.status !== "PENDING" &&
                  b.status !== "PAID"
                )
                  return -1;
                if (b.status === "ACCEPTED" && a.status !== "ACCEPTED")
                  return 1;

                return (
                  +new Date(a.journey.departureTime) -
                  +new Date(b.journey.departureTime)
                );
              })
              .map((booking) => {
                return (
                  <MyBookingCard
                    key={booking.id}
                    booking={booking}
                    onCompleteCancelBooking={() => {
                      if (userId) {
                        getUserBookings({
                          variables: { userId },
                        });
                      }
                    }}
                    bookingsRefetch={bookingRefetch}
                  />
                );
              })
          ) : (
            <div>Vous n&apos;avez aucune réservation !</div>
          )}
        </TabPanel>

        <TabPanel
          value="PENDING"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <OnPendingTab
            journeys={journeysData?.listJourneysByUser}
            journeysRefetch={journeysRefetch}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
}
