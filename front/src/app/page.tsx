"use client";

import SearchBar from "./components/SearchBar/SearchBar";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import { CookieValueTypes } from "cookies-next";
import landingPic from "@/assets/landing-pic.png";

import {
  ListJourneysQuery,
  ListJourneysWithFilters,
  useListJourneysLazyQuery,
} from "@/types/graphql";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import JourneyCard from "./components/JourneyCard/JourneyCard";
import CircularLoading from "./components/CircularLoading/CircularLoading";
import { useRouter } from "next/navigation";
import { routes } from "./lib/routes";

export type UserInfos = {
  email: CookieValueTypes;
  role: CookieValueTypes;
  firstname: CookieValueTypes;
  id: CookieValueTypes;
};

export default function Home() {
  const [journeys, setJourneys] = useState<ListJourneysQuery["listJourneys"]>();
  const router = useRouter();

  const [getJourneys, { loading: getJourneyLoading, error: getJourneyError }] =
    useListJourneysLazyQuery({
      fetchPolicy: "no-cache",
      onCompleted(data) {
        setJourneys(data.listJourneys);
      },
    });

  const [filters, setFilters] = useState<ListJourneysWithFilters>();

  const handleOnSearchJourneys = (filters?: ListJourneysWithFilters) => {
    if (!filters) {
      setJourneys(undefined);
      return;
    }
    setFilters(filters);
    localStorage.setItem("lastSearch", JSON.stringify(filters));

    getJourneys({
      variables: {
        filters,
      },
    });
  };

  useEffect(() => {
    getJourneyError && router.push(`${routes["error"].pathname}`);
  }, [getJourneyError, router]);

  if (getJourneyLoading) {
    return <CircularLoading />;
  }

  return (
    <div className="home_page flex-1 flex flex-col gap-6 h-full items-center justify-center align-center py-10">
      <Image
        src={landingPic}
        alt="logo_landing"
        height={350}
        width={500}
        className="hidden lg:block"
      />
      <Box
        className="h-full lg:h-fit flex flex-col lg:flex-row justify-center bg-primary80 lg:bg-primary10 rounded-xl"
        sx={{ width: { xs: "80%", lg: "100%" } }}
      >
        <h4 className="text-center text-2xl text-white  lg:hidden font-black mt-4">
          Il faut rouler Cool
        </h4>
        <SearchBar onSearchJourneys={handleOnSearchJourneys} />
      </Box>
      {journeys &&
        (journeys.length === 0 ? (
          <h3>Aucun trajet trouvé</h3>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {journeys.map(
              ({
                id,
                departureTime,
                price,
                user,
                origin,
                destination,
                availableSeats,
              }) => {
                dayjs.locale("fr");

                return (
                  <JourneyCard
                    departureTime={departureTime}
                    key={id}
                    id={id}
                    price={
                      filters?.availableSeats
                        ? price * filters?.availableSeats
                        : price
                    }
                    user={user}
                    origin={origin}
                    destination={destination}
                    availableSeats={availableSeats}
                  />
                );
              }
            )}
          </Grid>
        ))}
    </div>
  );
}
