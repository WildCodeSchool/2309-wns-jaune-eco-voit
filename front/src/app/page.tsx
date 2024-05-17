"use client";

import SearchBar from "./components/SearchBar/SearchBar";
import { CircularProgress, Grid, Link } from "@mui/material";
import { CookieValueTypes } from "cookies-next";

import {
  ListJourneysQuery,
  ListJourneysWithFilters,
  useListJourneysLazyQuery,
} from "@/types/graphql";
import { useState } from "react";

import dayjs from "dayjs";
import JourneyCard from "./components/JourneyCard/JourneyCard";
import { routes } from "./lib/routes";

export type UserInfos = {
  email: CookieValueTypes;
  role: CookieValueTypes;
  firstname: CookieValueTypes;
  id: CookieValueTypes;
};

export default function Home() {
  const [journeys, setJourneys] = useState<
    ListJourneysQuery["listJourneys"] | null
  >(null);

  const [getJourneys, { loading }] = useListJourneysLazyQuery({
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setJourneys(data.listJourneys);
    },
  });

  const [filters, setFilters] = useState<ListJourneysWithFilters | undefined>(
    undefined
  );

  const handleOnSearchJourneys = (filters?: ListJourneysWithFilters) => {
    if (!filters) {
      setJourneys(null);
      setFilters(filters);
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

  return (
    <div className="home_page flex-1 flex flex-col gap-6 h-full items-center justify-center bg-primary10 py-10">
      <h1>Il faut rouler cool Raoul !</h1>
      <h3 className="font-medium uppercase tracking-widest">Ecovoit</h3>

      <SearchBar onSearchJourneys={handleOnSearchJourneys} />
      {loading && <CircularProgress />}

      {journeys &&
        (journeys.length === 0 ? (
          <h3>Aucun trajet trouvé</h3>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {journeys.map(({ id, departure_time, totalPrice, ...rest }) => {
              dayjs.locale("fr");

              return (
                <JourneyCard
                  departureTime={departure_time}
                  key={id}
                  {...rest}
                  id={id}
                  totalPrice={
                    filters?.availableSeats
                      ? totalPrice * filters?.availableSeats
                      : totalPrice
                  }
                />
              );
            })}
          </Grid>
        ))}
    </div>
  );
}
