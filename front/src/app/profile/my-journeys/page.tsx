"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useGetProfileQuery, GetProfileDocument, useUpdateUserMutation, useListBookingsByUserLazyQuery, useListJourneysByUserLazyQuery, useListBookingsByUserQuery } from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Avatar, Box, Button, Card, CardContent, Tab, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import dayjs from "dayjs";


export default function MyJourneys() {
  const { getUser: userId } = useContext(AuthContext);
  const user = useListBookingsByUserQuery({variables:{userId: userId!}})

  const [value, setValue] = useState('1');
  const [getUserBookings, {data:bookingData,loading:bookingLoading,error:bookingError}]= useListBookingsByUserLazyQuery() // Lazy Query permet de créer une fonction quz l'on appelle quand on le veux 
  const [getUserJourneys, {data:journeyData,loading:journeyLoading,error:journeyError}]= useListJourneysByUserLazyQuery()
  
  useEffect(() =>{
    if(userId){
      getUserBookings({variables:{userId: userId}})
      getUserJourneys({variables:{userId: userId}})
      }
      },[getUserBookings, getUserJourneys, userId])
      

      const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        };


  if (!userId || bookingLoading || journeyLoading) {
    return <div>Loading ...</div>;
  }
  

  if (bookingError || journeyError) {
    return <div>Error</div>;
  }


  const formattedTime = dayjs(journeyData?.listJourneysByUser[0]?.departure_time).format("HH[h]mm");
  const formattedDate = dayjs(journeyData?.listJourneysByUser[0]?.departure_time).locale("fr").format("dddd D MMMM");

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Mes trajets" value="1" />
            <Tab label="Mes réservations" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {journeyData?.listJourneysByUser.map((journey, index) => (
            <Card key={index} className="flex items-center mb-4 p-4 m-auto  w-1/2">

                <Avatar
                  alt="profile picture"
                  src={journey?.user?.profilePicture ?? ""}
                />

              <CardContent className="flex-grow "  >
                <div className="flex items-center justify-between">
                  <Typography variant="h6" component="h6" className="font-semibold">
                    {journey.user.firstname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="text-sm">
                    {formattedDate} <br />Départ : {formattedTime}
                  </Typography>
                  <div className="flex flex-col items-center justify-evenly gap-2  m-2">
                     <Button className=" " onClick={() => {console.log("edit")}}>Modifier</Button>  { /* TODO faire la fonction de modification des journeys */}
                    <Button className="" onClick={() => {console.log("cancel")}}>Annuler</Button> { /* TODO faire la fonction de suppression des journeyx */}
                  </div>
                   
                </div>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap">
                  De {journey.origin} à {journey.destination}
                </Typography>
                <Typography variant="body1"  className="mt-2 text-gray-700 whitespace-pre-wrap"> 
                Siége dispobible : {journey.availableSeats}
                </Typography>
                <Typography>
                  Prix : {journey.totalPrice}€
                </Typography>
              </CardContent>
            </Card>
          ))}
        </TabPanel>
        <TabPanel value="2">
          {bookingData?.listBookingsByUser.map((booking, index) => (
            <Card key={index} className="flex items-center mb-4 p-4 m-auto  w-1/2 ">
                <Avatar
                  alt="profile picture"
                  src={booking?.journey?.user?.profilePicture ?? ""}
                />

              <CardContent className="flex-grow "  >
                <div className="flex items-center justify-between">
                  <Typography variant="h6" component="h6" className="font-semibold">
                    {booking?.journey?.user?.firstname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="text-sm">
                    {formattedDate} <br />Départ : {formattedTime}
                  </Typography>
                </div>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap">
                  De {booking.journey.origin} à {booking.journey.destination}
                  <div className="flex flex-col items-center justify-evenly gap-2  m-2">
                    <Button className="" onClick={() => {console.log("cancel")}}>Annuler</Button> { /* TODO faire la fonction de suppression des journeyx */}
                  </div>
                </Typography>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap"> 
                Siége disponible : {booking.journey.availableSeats}
                </Typography>
                <Typography>
                  Prix : {booking.journey.totalPrice}€
                </Typography>
              </CardContent>
            </Card>
            ))}
        </TabPanel>
      </TabContext>
    </div>
  );
}
