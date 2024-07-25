"use client";
import { SyntheticEvent, useState } from "react";
import BookingsAdmin from "./components/BookingsAdmin";
import JourneysAdmin from "./components/JourneysAdmin";
import UsersAdmin from "./components/UsersAdmin";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";

export type AdminTabs = "USERS" | "BOOKINGS" | "JOURNEYS";
const Admin = () => {
  const [tabDisplayed, setTabDisplayed] = useState<AdminTabs>("JOURNEYS");

  const handleChange = (e: SyntheticEvent, newValue: AdminTabs) => {
    setTabDisplayed(newValue);
  };

  return (
    // <div className="admin-panel flex flex-col gap-8 px-12 py-8">
    <TabContext value={tabDisplayed}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="Administration tabs">
          <Tab label="Trajets" value="JOURNEYS" />
          <Tab label="Réservations" value="BOOKINGS" />
          <Tab label="Utilisateurs" value="USERS" />
        </TabList>
      </Box>
      <TabPanel value="JOURNEYS">
        <JourneysAdmin />
      </TabPanel>
      <TabPanel value="BOOKINGS">
        <BookingsAdmin />
      </TabPanel>
      <TabPanel value="USERS">
        <UsersAdmin />
      </TabPanel>
    </TabContext>
    // {/* <h2>Panneau d&apos;administration</h2> */}
    // {/* <BookingsAdmin />
    // <JourneysAdmin />
    // <UsersAdmin /> */}
    // </div>
  );
};

export default Admin;
