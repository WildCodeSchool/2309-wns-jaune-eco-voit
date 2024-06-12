"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { GetProfileDocument, useFindJourneyByIdQuery, useGetProfileQuery, useUpdateUserMutation } from "@/types/graphql";
import { AuthContext } from "@/context/authContext";
import { Avatar, Box, Card, CardContent, Stack, Tab, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";

type JourneyMessageCardProps = {
    firstname: string;
    createdAt: Date;
    content: string;
  };

interface MyJourneysProps extends JourneyMessageCardProps {
  params: {
    id: string;
  };
}
  

export default function MyJourneys({
    firstname,
    createdAt,
    content,
    params: { id: journeyId }
  }: MyJourneysProps) {
    // Vous pouvez maintenant utiliser 'journeyId' ici
    console.log("journeyId" , journeyId);
  
    // export default function MyJourneys({ params }: { params: { id: string }    }) {
  const { data, loading, error } = useGetProfileQuery({fetchPolicy: "network-only"}); // fetchPolicy: "network-only" : permet d'afficher les nouvelles informations enregistrer sans rafraichir la page
  const [updateUser] = useUpdateUserMutation({refetchQueries: [{query: GetProfileDocument}]});
  const {getUser} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [updateInfos, setUpdateInfos] = useState<any>({});
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(data){
      setUpdateInfos(data?.getProfile)
    }
}, [data]);

// const {  journeyId } = params;

console.log("updateInfos", updateInfos)
const {
    data: journeyData,
    loading: journeyLoading,
    error: journeyError,
  } = useFindJourneyByIdQuery({
    variables: {
      findJourneyById: journeyId,
    },
  });

  if(loading){
    return <div> Loading ...</div>
  }

  if(error){
    return <div>Error</div>
  }
  


  return (
    <Stack> 
      
    <TabContext value={value}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <TabList onChange={handleChange} aria-label="lab API tabs example">
      <Tab label="Mes trajets" value="1" />
      <Tab label="Mes réservations" value="2" />
    </TabList>
  </Box>
  <TabPanel value="1">
    <Card className="flex items-start mb-4 p-4 shadow-sm">
      <Avatar
        className="mr-4"
        src={
          "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
        }
      >
        {firstname}
      </Avatar>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <Typography variant="h6" component="h6" className="font-semibold">
            {firstname}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="text-sm">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </div>
        <Typography
          variant="body1"
          className="mt-2 text-gray-700 whitespace-pre-wrap"
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
    </TabPanel>
  <TabPanel value="2">Item Two</TabPanel>
</TabContext>
    </Stack>
  );
};
