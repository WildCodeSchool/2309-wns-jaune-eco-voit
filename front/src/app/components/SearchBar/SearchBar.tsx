import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Divider,
  Box,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

import AddressAutoComplete, { AddressResponse } from "./AddressAutoComplete";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ListJourneysWithFilters } from "@/types/graphql";

import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    borderRadius: 0,
    border: "0",
  },
});

const StyledSelect = styled(Select)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input": {
    borderRadius: 0,
    border: "0",
  },
});
type SearchJourneysProps = {
  onSearchJourneys: (filters?: ListJourneysWithFilters) => void;
};

const SearchBar = ({ onSearchJourneys }: SearchJourneysProps) => {
  const [destination, setDestination] = useState<AddressResponse | null>(null);
  const [origin, setOrigin] = useState<AddressResponse | null>(null);
  const [departureTime, setDepartureTime] = useState<Dayjs | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number>(1);

  const [warning, setWarning] = useState<string>("");

  const availableSeatsArray = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSearch = () => {
    if (origin && destination && departureTime && availableSeats) {
      onSearchJourneys({
        origin: origin.city,
        destination: destination.city,
        departureTime,
        availableSeats,
      });

      setWarning("");
    } else {
      onSearchJourneys();
      setWarning("Veuillez renseigner tous les champs");
    }
  };

  return (
    <Stack gap={2} margin={2} className="h-14">
      <Stack
        direction={{ sm: "column", md: "row" }}
        className="rounded-full  h-14 bg-white"
      >
        <AddressAutoComplete
          label={"Départ"}
          handleSelectedAddress={(value: AddressResponse | null) =>
            setOrigin(value)
          }
          clearAddress={() => setOrigin(null)}
          sx={{
            borderRadius: "32px 0 0 32px",
          }}
          gotAdornment
        />
        <Divider flexItem orientation="vertical" />
        <AddressAutoComplete
          label={"Arrivée"}
          handleSelectedAddress={(value: AddressResponse | null) =>
            setDestination(value)
          }
          clearAddress={() => setDestination(null)}
          sx={{
            borderRadius: "0",
            border: "0!important",
            borderWidth: "0",
          }}
          gotAdornment
        />
        <Divider flexItem orientation="vertical" />
        <DatePicker
          value={departureTime}
          onChange={(date) => setDepartureTime(date)}
          name="departureTime"
          minDate={dayjs()}
          slotProps={{
            inputAdornment: {
              position: "start",
            },
          }}
          sx={{
            width: "200px",
            border: "0",
            height: "auto",
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              border: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiInputBase-input": {
              borderRadius: 0,
              border: "0",
            },
          }}
        />
        <Divider flexItem orientation="vertical" />
        <FormControl sx={{ width: "100px", border: 0, margin: "0 2em" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon color="primary" />
            <StyledSelect
              value={availableSeats}
              label="Places"
              onChange={(e: any) => setAvailableSeats(Number(e.target.value))}
              sx={{ borderRadius: 0, width: "100px" }}
            >
              {availableSeatsArray.map((seat) => (
                <MenuItem value={seat} key={seat}>
                  {seat}
                </MenuItem>
              ))}
            </StyledSelect>
          </Box>
        </FormControl>

        <Button
          className="h-14 self-baseline md:self-end"
          onClick={handleSearch}
          variant={"contained"}
          sx={{
            borderRadius: "0 32px 32px 0",
          }}
        >
          Rechercher
        </Button>
      </Stack>
      {warning && <p className="text-primary120 text-left">{warning}</p>}
    </Stack>
  );
};

export default SearchBar;
