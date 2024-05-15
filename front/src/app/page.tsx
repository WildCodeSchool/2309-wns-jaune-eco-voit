"use client";

import SearchBar from "./components/SearchBar/SearchBar";
import { Avatar, Button, Rating, Stack } from "@mui/material";
import { CookieValueTypes } from "cookies-next";
import SearchJourneys from "./components/layout/journeys/SearchJourneys";
import { routes } from "./lib/routes";
import { useRouter } from "next/navigation";
import {
  ListJourneysQuery,
  ListJourneysWithFilters,
  useListJourneysLazyQuery,
} from "@/types/graphql";
import { useState } from "react";
import Image from "next/image";

import logo from "@/assets/logo_journey.svg";
import dayjs from "dayjs";
import "dayjs/locale/fr"; // Import French locale
import PersonIcon from "@mui/icons-material/Person";

export type UserInfos = {
  email: CookieValueTypes;
  role: CookieValueTypes;
  firstname: CookieValueTypes;
  id: CookieValueTypes;
};

export default function Home() {
  const router = useRouter();

  const [journeys, setJourneys] = useState<ListJourneysQuery["listJourneys"]>(
    []
  );

  const [getJourneys, { data, loading, error }] = useListJourneysLazyQuery({
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setJourneys(data.listJourneys);
      console.log(data.listJourneys);
    },
  });

  const handleOnSearchJourneys = (filters?: ListJourneysWithFilters) => {
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

      <SearchBar />
      <div className="flex gap-3">
        <Button variant="outlined">outlined</Button>
        <Button variant="outlined" color="secondary">
          outlined
        </Button>
        <Button>text</Button>
        <Button color="secondary">text</Button>
        <Button variant={"contained"}>Contained</Button>
        <Button variant={"contained"} color="secondary">
          Contained
        </Button>
      </div>
      <SearchJourneys onSearchJourneys={handleOnSearchJourneys} />

      {/* <Button variant="outlined">outlined</Button>
      <Button variant="outlined" color="secondary">
        outlined
      </Button>
      <Button>text</Button>
      <Button color="secondary">text</Button>
      <Button variant={"contained"}>Contained</Button>
      <Button variant={"contained"} color="secondary">
        Contained
      </Button> */}
      <Stack direction="row" className="w-8/12">
        {journeys.length > 0 &&
          journeys.map(
            ({
              destination,
              departure_time,
              origin,
              user,
              availableSeats,
              totalPrice,
            }) => {
              dayjs.locale("fr");

              const formattedTime = dayjs("2011-10-05T14:48:00.000Z").format(
                "HH[h]mm"
              );
              const formattedDate = dayjs("2011-10-05T14:48:00.000Z")
                .locale("fr")
                .format("dddd D MMMM");

              return (
                <div
                  className="flex flex-col rounded-2xl bg-white p-6 w-/12 gap-6"
                  key={departure_time}
                >
                  <div className="flex flex-row justify-between text-base">
                    <div className="flex flex-col gap-2  leading-5	">
                      <Image
                        src={logo}
                        alt="logo_journey"
                        width={85}
                        height={40}
                      />
                      <p className="pt-3 font-semibold">
                        {journeys[0].origin} - {journeys[0].destination}
                      </p>
                      <p className="font-medium">Départ {formattedTime} </p>
                    </div>
                    <div>
                      <p className="rounded-full bg-dark100 text-white p-1 px-3">
                        {formattedDate[0].toUpperCase()}
                        {formattedDate.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className=" py-4 gap-4">
                    <div className="flex gap-6">
                      <Avatar
                        alt="profile picture"
                        src="https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
                        sx={{ width: 70, height: 70 }}
                      />{" "}
                      <div className=" flex flex-col justify-around">
                        <div className="flex text-lg gap-2">
                          <p className="font-semibold">{user.firstname}</p>
                          <p>(Mercedes Benz)</p>
                        </div>
                        <div>
                          <Rating value={4} disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    <div className="flex gap-3 items-center ">
                      <PersonIcon
                        sx={{ width: 40, height: 40, color: "#9695A3" }}
                      />
                      <p className="m-0 font-bold text-dark60">
                        {availableSeats} places disponibles
                      </p>
                    </div>
                    <div className="font-bold text-2xl">{totalPrice} €</div>
                  </div>
                </div>
              );
            }
          )}
      </Stack>
    </div>
  );
}
