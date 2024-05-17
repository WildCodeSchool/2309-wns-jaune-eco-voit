import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { JourneyData } from "../page";

type OptionsProps = {
  journeyData: JourneyData;
  setJourneyData: React.Dispatch<React.SetStateAction<JourneyData>>;
};

const Options = ({ journeyData, setJourneyData }: OptionsProps) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={journeyData.automaticAccept}
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
    </>
  );
};

export default Options;
