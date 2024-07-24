import {
  JourneyData,
  UpdateOrCreateJourneyProps,
} from "@/app/components/JourneyCreateOrUpdate/UpdateOrCreate";
import { Checkbox, FormControlLabel } from "@mui/material";

type OptionsProps = {
  journeyData: JourneyData;
  setJourneyData: UpdateOrCreateJourneyProps["setJourneyData"];
};

const Options = ({
  journeyData: { automaticAccept },
  setJourneyData,
}: OptionsProps) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={automaticAccept}
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
