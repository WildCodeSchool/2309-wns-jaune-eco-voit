import AddressAutoComplete, {
  AddressResponse,
} from "@/app/components/SearchBar/AddressAutoComplete";
import {
  JourneyData,
  UpdateOrCreateJourneyProps,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { useState } from "react";

export type FromTo = "origin" | "destination";

type CityInputProps = {
  setJourneyData: UpdateOrCreateJourneyProps["setJourneyData"];
  fromTo: FromTo;
  defaultValue?: string;
  journeyData?: JourneyData;
};

const CityInput = ({
  setJourneyData,
  fromTo,
  defaultValue,
  journeyData,
}: CityInputProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectCity = (value: AddressResponse) => {
    if (!value) {
      return;
    }

    if (fromTo === "destination") {
      if (journeyData?.origin === value.city) {
        setErrorMessage(
          "Votre point d&apos;arrivée ne peut pas être le meme que votre point de départ"
        );
        return;
      }
    }

    setJourneyData((prevState) => ({
      ...prevState,
      [fromTo]: value.city ?? "",
    }));
  };

  return (
    <>
      <AddressAutoComplete
        defaultValue={defaultValue}
        label={fromTo === "origin" ? "Point de départ" : "Point d'arrivée"}
        clearAddress={() =>
          setJourneyData((prevState) => ({ ...prevState, [fromTo]: "" }))
        }
        handleSelectedAddress={(value) => handleSelectCity(value)}
        handleOnChange={() => setErrorMessage(null)}
      />
      {!!errorMessage && (
        <p>
          Votre point d&apos;arrivée ne peut pas être le meme que votre point de
          départ
        </p>
      )}
    </>
  );
};

export default CityInput;
