import AddressAutoComplete from "@/app/components/SearchBar/AddressAutoComplete";
import React, { Dispatch, SetStateAction } from "react";
import { JourneyData } from "../page";

export type FromTo = "origin" | "destination";
type CityInputProps = {
  setJourneyData: Dispatch<SetStateAction<JourneyData>>;
  fromTo: FromTo;
  defaultValue?: string;
};
const CityInput = ({
  setJourneyData,
  fromTo,
  defaultValue,
}: CityInputProps) => {
  return (
    <>
      <AddressAutoComplete
        defaultValue={defaultValue}
        label={fromTo === "origin" ? "Point de départ" : "Point d'arrivée"}
        clearAddress={() =>
          setJourneyData((prevState) => ({ ...prevState, [fromTo]: "" }))
        }
        handleSelectedAddress={(value) => {
          if (!value) {
            return;
          }

          setJourneyData((prevState) => ({
            ...prevState,
            //@ts-ignore
            [fromTo]: value.city ?? "",
          }));
        }}
      />
    </>
  );
};

export default CityInput;
