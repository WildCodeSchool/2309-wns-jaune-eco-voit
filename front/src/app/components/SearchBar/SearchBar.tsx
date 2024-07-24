import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddressAutoComplete, { AddressResponse } from "./AddressAutoComplete";
import { useState, useContext } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ListJourneysWithFilters } from "@/types/graphql";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { AuthContext } from "@/context/authContext";

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
  const [destination, setDestination] = useState<AddressResponse>();
  const [origin, setOrigin] = useState<AddressResponse>();
  const [departureTime, setDepartureTime] = useState<Dayjs | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number>(1);
  const [warning, setWarning] = useState<string>("");

  const { getUser: currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const availableSeatsArray = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSearch = () => {
    if (origin && destination && departureTime && availableSeats) {
      const filters: any = {
        origin: origin.nom,
        destination: destination.nom,
        departureTime,
        availableSeats,
      };
      if (currentUser) {
        console.log("tik");
        filters.user = { id: currentUser };
      }

      onSearchJourneys(filters);

      setWarning("");
    } else {
      onSearchJourneys();
      setWarning("Veuillez renseigner tous les champs");
    }
  };

  return (
    <Stack gap={2} margin={2} className="h-14">
      <Stack
        gap={2}
        margin={2}
        justifyContent={"center"}
        className="lg:w-full flex justify-center bg-white lg:bg-primary10  p-4 lg:p-0 rounded-xl "
      >
        <Box className="h-full lg:h-14 flex flex-col justify-center lg:flex-row">
          <AddressAutoComplete
            label={"Départ"}
            handleSelectedAddress={(value: AddressResponse) => setOrigin(value)}
            clearAddress={() => setOrigin(undefined)}
            sx={{
              background: "white",
            }}
            gotAdornment
            isFirstElement
          />
          <Divider
            flexItem
            orientation={matches ? "vertical" : "horizontal"}
            sx={{ marginY: "10px" }}
          />
          <AddressAutoComplete
            label={"Arrivée"}
            handleSelectedAddress={(value: AddressResponse) =>
              setDestination(value)
            }
            clearAddress={() => setDestination(undefined)}
            sx={{
              borderRadius: "0",
              border: "0!important",
              borderWidth: "0",
            }}
            gotAdornment
          />
          <Divider
            flexItem
            orientation={matches ? "vertical" : "horizontal"}
            sx={{ marginY: "10px" }}
          />
          <DatePicker
            value={departureTime}
            onChange={(date) => setDepartureTime(date)}
            name="departureTime"
            minDate={dayjs()}
            slotProps={{
              inputAdornment: {
                position: "start",
              },
              field: {
                readOnly: true,
              },
            }}
            sx={{
              width: { sm: "100%", lg: "200px" },
              border: "0",
              background: "white",
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
          <Divider
            flexItem
            orientation={matches ? "vertical" : "horizontal"}
            sx={{ marginY: "10px" }}
          />
          <FormControl
            sx={{
              border: 0,
              padding: { xs: 0, lg: "0 2em" },
              background: "white",
              marginBottom: { xs: "20px", lg: 0 },
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <PersonIcon color="primary" />
              <StyledSelect
                value={availableSeats}
                label="Places"
                onChange={(e: any) => setAvailableSeats(Number(e.target.value))}
                sx={{ borderRadius: 0, width: { xs: "100%", lg: "100px" } }}
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
            className="h-14 self-center mt-4 lg:mt-0 lg:self-end"
            onClick={handleSearch}
            variant={"contained"}
            fullWidth={!matches}
            sx={{
              borderRadius: { sx: "32px", lg: "0 32px 32px 0" },
            }}
          >
            Rechercher
          </Button>
        </Box>
      </Stack>
      {warning && <p className="text-primary120 text-left">{warning}</p>}
    </Stack>
  );
};

export default SearchBar;
