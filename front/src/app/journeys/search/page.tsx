"use client";

import {
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
import dayjs, { Dayjs } from "dayjs";

function SearchJourneys() {
  const [listJourneys] = useListJourneysLazyQuery();

  // const [departureTime, setDepartureTime] = useState<Dayjs | null>(
  //   dayjs(new Date())
  // );

  // const handleChange = (newValue: Dayjs | null) => {
  //   setDepartureTime(newValue);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
  };

  return (
    <Container>
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
              <FormControl style={{ flexGrow: 1, flexBasis: 0 }}>
                <DatePicker label="Date de départ" name="date" />
              </FormControl>
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
    </Container>
  );
}

export default SearchJourneys;
