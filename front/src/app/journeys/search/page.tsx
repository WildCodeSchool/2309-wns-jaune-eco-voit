import { ListJourneysWithFilters } from "@/types/graphql";
import { Grid, TableContainer } from "@mui/material";
import { Container } from "postcss";
import { useState } from "react";

const defaultFilters: ListJourneysWithFilters = {
  automaticAccept: false,
  origin: null,
  destination: null,
  departureTime: null,
};

export function SearchJourneys() {
  const [journeyFilters, setJourneyFilters] = useState(defaultFilters);

  return
  <TableContainer>
    <Grid container spacing={2}>
  <Grid item xs={6}>
    <Item>xs=8</Item>
  </Grid>
  <Grid item xs={6}>
    <Item>xs=4</Item>
  </Grid>
  <Grid item xs={4}>
    <Item>xs=4</Item>
  </Grid>
  <Grid item xs={8}>
    <Item>xs=8</Item>
  </Grid>
</Grid>
  </Container>
  ;
}
