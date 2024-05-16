import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { JourneyData } from "../page";

type CountInputProps = {
  journeyData: JourneyData;
  setJourneyData: React.Dispatch<React.SetStateAction<JourneyData>>;
  availableSeatsOrTotalPrice: "availableSeats" | "totalPrice";
  minValue?: number;
};

const CountInput = ({
  journeyData,
  setJourneyData,
  availableSeatsOrTotalPrice,
  minValue = 0,
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
                prevState[availableSeatsOrTotalPrice] + 1,
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

{
  /* 
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
</div> */
}
