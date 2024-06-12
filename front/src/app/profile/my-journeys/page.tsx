"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useGetProfileQuery, useListJourneysByUserQuery, GetProfileDocument, useUpdateUserMutation, useListBookingsByJourneyQuery } from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Avatar, Box, Card, CardContent, Stack, Tab, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import dayjs from "dayjs";


export default function MyJourneys() {
  const { data, loading, error } = useGetProfileQuery({ fetchPolicy: "network-only" });
  const [updateUser] = useUpdateUserMutation({ refetchQueries: [{ query: GetProfileDocument }] });
  const { getUser: userId } = useContext(AuthContext);
  const [updateInfos, setUpdateInfos] = useState<any>({});
  const [value, setValue] = useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [userUserPicture, setUserUserPicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setUpdateInfos(data?.getProfile);
    }
  }, [data]);


  const { data: journeyData, loading: journeyLoading, error: journeyError } = useListJourneysByUserQuery({
    variables: { userId: userId || "" },
  });

  const { data : bookingData, loading: bookingLoading, error: bookingError } = useListBookingsByJourneyQuery({
    variables: { journeyId: journeyData?.listJourneysByUser[0]?.id || "" },
    
  })

  if (loading || journeyLoading) {
    return <div>Loading ...</div>;
  }

  if (error || journeyError) {
    return <div>Error</div>;
  }


  const formattedTime = dayjs(journeyData?.listJourneysByUser[0]?.departure_time).format("HH[h]mm");
  const formattedDate = dayjs(journeyData?.listJourneysByUser[0]?.departure_time).locale("fr").format("dddd D MMMM");

  return (
    <Stack >
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
                  src={
                    !userUserPicture
                      ? "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
                      : userUserPicture
                  }
                />

              <CardContent className="flex-grow "  >
                <div className="flex items-center justify-between">
                  <Typography variant="h6" component="h6" className="font-semibold">
                    {journey.user.firstname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="text-sm">
                    {formattedDate} <br />Départ : {formattedTime}
                  </Typography>
                </div>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap">
                  De {journey.origin} à {journey.destination}
                </Typography>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap"> 
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
          {bookingData?.listBookingsByJourney.map((booking, index) => (
            <Card key={index} className="flex items-center mb-4 p-4 m-auto  w-1/2">

                <Avatar
                  alt="profile picture"
                  src={
                    !userUserPicture
                      ? "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
                      : userUserPicture
                  }
                />

              <CardContent className="flex-grow "  >
                <div className="flex items-center justify-between">
                  <Typography variant="h6" component="h6" className="font-semibold">
                    {booking.user.firstname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="text-sm">
                    {formattedDate} <br />Départ : {formattedTime}
                  </Typography>
                </div>
                <Typography variant="body1" className="mt-2 text-gray-700 whitespace-pre-wrap">
                  De {booking.journey.origin} à {booking.journey.destination}
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
    </Stack>
  );
}
