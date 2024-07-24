import {
  JourneyData,
  UpdateOrCreateJourneyProps,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

type CountInputProps = {
  journeyData: JourneyData;
  setJourneyData: UpdateOrCreateJourneyProps["setJourneyData"];
  availableSeatsOrPrice: "availableSeats" | "price";
  minValue?: number;
  maxValue?: number;
};

const CountInput = ({
  journeyData,
  setJourneyData,
  availableSeatsOrPrice,
  minValue = 0,
  maxValue,
}: CountInputProps) => {
  const handleDecrement = () => {
    setJourneyData((prevState: JourneyData) => {
      const newValue = Math.max(prevState[availableSeatsOrPrice] - 1, minValue);
      return {
        ...prevState,
        [availableSeatsOrPrice]: newValue,
      };
    });
  };

  const handleIncrement = () => {
    setJourneyData((prevState: JourneyData) => {
      const newValue = maxValue
        ? Math.min(prevState[availableSeatsOrPrice] + 1, maxValue)
        : prevState[availableSeatsOrPrice] + 1;
      return {
        ...prevState,
        [availableSeatsOrPrice]: newValue,
      };
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setJourneyData((prevState: JourneyData) => ({
      ...prevState,
      [availableSeatsOrPrice]: isNaN(value)
        ? minValue
        : maxValue && value > maxValue
        ? maxValue
        : value < minValue
        ? minValue
        : value,
    }));
  };

  return (
    <div className="flex gap-5 items-center">
      <button
        className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
        onClick={handleDecrement}
      >
        -
      </button>
      <TextField
        value={journeyData[availableSeatsOrPrice]}
        onChange={handleChange}
        variant="filled"
        type="number"
        sx={{ fontSize: "5rem" }}
        InputProps={{
          onWheel: (event) => {
            if (event.target instanceof HTMLInputElement) event.target.blur();
          },
          inputProps: { min: minValue },
          startAdornment: availableSeatsOrPrice === "price" && (
            <InputAdornment position="start">€</InputAdornment>
          ),
        }}
      />
      <button
        className="rounded-full hover:bg-primary20 cursor-pointer border-2 text-primary100 border-primary100 h-10 w-10 flex justify-center items-center aspect-square"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};

export default CountInput;
