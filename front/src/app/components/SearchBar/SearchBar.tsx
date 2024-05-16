import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import AddressAutoComplete, { AddressResponse } from "./AddressAutoComplete";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ListJourneysWithFilters } from "@/types/graphql";

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
    <Stack gap={2} margin={2}>
      <Stack direction={{ sm: "column", md: "row" }}>
        <AddressAutoComplete
          label={"Départ"}
          handleSelectedAddress={(value: AddressResponse | null) =>
            setOrigin(value)
          }
          clearAddress={() => setOrigin(null)}
          sx={{
            borderRadius: "32px 0 0 32px",
          }}
        />
        <AddressAutoComplete
          label={"Arrivée"}
          handleSelectedAddress={(value: AddressResponse | null) =>
            setDestination(value)
          }
          clearAddress={() => setDestination(null)}
          sx={{
            borderRadius: "0",
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={departureTime}
            onChange={(date) => setDepartureTime(date)}
            label="Date de départ"
            name="departureTime"
            minDate={dayjs()}
            sx={{ width: "200px" }}
          />
        </LocalizationProvider>
        <FormControl sx={{ width: "200px", border: 0 }}>
          <InputLabel id="select-available-seats">Places</InputLabel>
          <Select
            value={availableSeats}
            labelId="select-available-seats"
            onChange={(e) => setAvailableSeats(Number(e.target.value))}
            sx={{ borderRadius: 0 }}
          >
            {availableSeatsArray.map((seat) => (
              <MenuItem value={seat} key={seat}>
                {seat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          className="h-14 self-baseline md:self-end"
          onClick={handleSearch}
          variant={"contained"}
        >
          Rechercher
        </Button>
      </Stack>
      {warning && <p className="text-primary120 text-left">{warning}</p>}
    </Stack>
  );
};

export default SearchBar;
