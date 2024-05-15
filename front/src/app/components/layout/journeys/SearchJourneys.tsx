"use client";

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useListJourneysLazyQuery } from "@/types/graphql";
import { Dayjs } from "dayjs";

type SearchJourneysProps = {
  onSearchJourneys: () => void;
};

function SearchJourneys({ onSearchJourneys }: SearchJourneysProps) {
  const [departureTime, setDepartureTime] = useState<Dayjs | null>(null);

  const [getJourneys, { data, loading, error }] = useListJourneysLazyQuery({
    fetchPolicy: "no-cache",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const origin = formData.get("origin") as string;
    const destination = formData.get("destination") as string;
    onSearchJourneys();
  };

  return (
    <Container>
      <Box
        sx={{
          height: "auto",
          border: "2px solid #8D84EF",
          borderRadius: "8px",
          mx: "auto",
          p: "1rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="column"
            className="w-full gap-2"
          >
            <div className="flex gap-4">
              <FormControl style={{ flexGrow: 1, flexBasis: 0 }}>
                <TextField name="origin" label="Origine" fullWidth />
              </FormControl>
              <FormControl style={{ flexGrow: 1, flexBasis: 0 }}>
                <TextField name="destination" label="Destination" fullWidth />
              </FormControl>
            </div>
            <div className="flex gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={departureTime}
                  onChange={(date) => setDepartureTime(date)}
                  label="Date de départ"
                  name="departureTime"
                />
              </LocalizationProvider>
              <FormControlLabel
                control={<Checkbox />}
                label="Acceptation automatique"
                name="automaticAccept"
              />
            </div>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Rechercher
            </Button>
          </Stack>
        </form>
        {data && JSON.stringify(data)}
      </Box>
    </Container>
  );
}

export default SearchJourneys;
