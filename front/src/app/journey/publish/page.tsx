"use client";
import React, { useEffect, useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { FormControlLabel, InputAdornment, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import fr from "dayjs/locale/fr";
import Checkbox from "@mui/material/Checkbox";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.locale(fr);

const PublishJourney = () => {
  const [journeyData, setJourneyData] = useState({
    origin: "",
    destination: "",
    departure_date: dayjs(),
    totalPrice: 0,
    automaticAccept: true,
    availableSeats: 1,
  });

  console.log("journeyData", journeyData);

  return (
    <div className="publish_page flex-1">
      <div className="origin">
        <h3>D'où partez-vous</h3>
        <TextField
          value={journeyData.origin}
          onChange={(value) =>
            setJourneyData((prevState) => ({
              ...prevState,
              origin: value.target.value,
            }))
          }
          label="origin"
          className="origin_input"
          type="text"
          name="origin"
          placeholder="Entrez le nom de la ville de départ"
        />
      </div>
      <div className="destination">
        <h3>Où allez-vous?</h3>
        <TextField
          value={journeyData.destination}
          onChange={(value) =>
            setJourneyData((prevState) => ({
              ...prevState,
              destination: value.target.value,
            }))
          }
          label="destination"
          className="destination_input"
          type="text"
          name="destination"
          placeholder="Entrez le nom de la ville d'arrivée"
        />
      </div>
      <div className="date w-fit">
        <h3>Choisissez la date de votre départ</h3>

        <DateCalendar
          className="date_input"
          value={journeyData.departure_date}
          onChange={(newValue) =>
            setJourneyData((prevState) => ({
              ...prevState,
              departure_date: newValue,
            }))
          }
          minDate={dayjs()}
          timezone="UTC"
        />
      </div>

      <div className="departure_time">
        <h3>À quelle heure souhaitez-vous partir?</h3>
        <TimePicker
          timezone="system"
          value={journeyData.departure_date}
          onChange={(newValue) =>
            setJourneyData((prevState) => ({
              ...prevState,
              departure_date: newValue || dayjs(),
            }))
          }
          label="departure_time"
          ampm={false}
        />
      </div>

      <div className="passengers">
        <h3>Combien de passagers acceptez-vous?</h3>
        <div className="flex gap-5 items-center">
          <button
            className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
            onClick={() =>
              setJourneyData((prevState) => ({
                ...prevState,
                availableSeats:
                  prevState.availableSeats > 1
                    ? prevState.availableSeats - 1
                    : prevState.availableSeats,
              }))
            }
          >
            -
          </button>
          <TextField
            value={journeyData.availableSeats}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setJourneyData((prevState) => ({
                ...prevState,
                availableSeats: parseInt(event.target.value),
              }));
            }}
            variant="filled"
            type="number"
            sx={{ fontSize: "5rem" }}
            InputProps={{
              onWheel: (event) => {
                if (event.target instanceof HTMLInputElement)
                  event.target.blur();
              },
              inputProps: { min: 1 },
            }}
          />
          <button
            className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
            onClick={() =>
              setJourneyData((prevState) => ({
                ...prevState,
                availableSeats: prevState.availableSeats + 1,
              }))
            }
          >
            +
          </button>
        </div>
      </div>
      <div>
        <h3>Fixez votre prix par place</h3>
        <div className="flex gap-5 items-center">
          <button
            className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
            onClick={() =>
              setJourneyData((prevState) => ({
                ...prevState,
                totalPrice:
                  prevState.totalPrice > 0
                    ? prevState.totalPrice - 1
                    : prevState.totalPrice,
              }))
            }
          >
            -
          </button>
          <TextField
            value={journeyData.totalPrice}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setJourneyData((prevState) => ({
                ...prevState,
                totalPrice: parseInt(event.target.value),
              }));
            }}
            variant="filled"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              onWheel: (event) => {
                if (event.target instanceof HTMLInputElement)
                  event.target.blur();
              },
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
          />
          <button
            className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
            onClick={() =>
              setJourneyData((prevState) => ({
                ...prevState,
                totalPrice: prevState.totalPrice + 1,
              }))
            }
          >
            +
          </button>
        </div>
      </div>
      <div>
        <h3>Activer la réservation automatique</h3>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              value={journeyData.automaticAccept}
              onChange={(e) =>
                setJourneyData((prevState) => ({
                  ...prevState,
                  automaticAccept: e.target.checked,
                }))
              }
            />
          }
          label="Réservation automatique"
        />
      </div>
    </div>
  );
};

export default PublishJourney;
