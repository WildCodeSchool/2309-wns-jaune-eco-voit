import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { JourneyData } from "../page";

type CountInputProps = {
  journeyData: JourneyData;
  setJourneyData: React.Dispatch<React.SetStateAction<JourneyData>>;
  availableSeatsOrTotalPrice: "availableSeats" | "totalPrice";
  minValue?: number;
  maxValue?: number;
};

const CountInput = ({
  journeyData,
  setJourneyData,
  availableSeatsOrTotalPrice,
  minValue = 0,
  maxValue,
}: CountInputProps) => {
  return (
    <>
      <div className="flex gap-5 items-center">
        <button
          className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
          onClick={() =>
            setJourneyData((prevState) => ({
              ...prevState,
              [availableSeatsOrTotalPrice]:
                prevState[availableSeatsOrTotalPrice] > 1
                  ? prevState[availableSeatsOrTotalPrice] - 1
                  : prevState[availableSeatsOrTotalPrice],
            }))
          }
        >
          -
        </button>
        <TextField
          value={journeyData[availableSeatsOrTotalPrice]}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setJourneyData((prevState) => ({
              ...prevState,
              [availableSeatsOrTotalPrice]:
                parseInt(event.target.value) < minValue || !event.target.value
                  ? minValue
                  : maxValue && parseInt(event.target.value) > maxValue
                  ? maxValue
                  : parseInt(event.target.value),
            }));
          }}
          variant="filled"
          type="number"
          sx={{ fontSize: "5rem" }}
          InputProps={{
            onWheel: (event) => {
              if (event.target instanceof HTMLInputElement) event.target.blur();
            },
            inputProps: { min: minValue },
            startAdornment: availableSeatsOrTotalPrice === "totalPrice" && (
              <InputAdornment position="start">€</InputAdornment>
            ),
          }}
        />
        <button
          className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
          onClick={() =>
            setJourneyData((prevState) => ({
              ...prevState,
              [availableSeatsOrTotalPrice]:
                (availableSeatsOrTotalPrice === "availableSeats" &&
                  prevState[availableSeatsOrTotalPrice] < 8) ||
                availableSeatsOrTotalPrice === "totalPrice"
                  ? prevState[availableSeatsOrTotalPrice] + 1
                  : prevState[availableSeatsOrTotalPrice],
            }))
          }
        >
          +
        </button>
      </div>
    </>
  );
};

export default CountInput;
