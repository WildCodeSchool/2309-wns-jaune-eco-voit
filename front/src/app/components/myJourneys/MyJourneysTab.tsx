import { formattedDate, formattedTime } from "@/app/utils/date";
import { ListJourneysByUserQuery } from "@/types/graphql";
import { TabPanel } from "@mui/lab";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import CircularLoading from "../CircularLoading/CircularLoading";

type MyJourneysTabProps = {
  journeys?: ListJourneysByUserQuery["listJourneysByUser"];
  onCancelJourney: (id: string) => void;
  isLoading: boolean;
  onEditJourney: (id: string) => void;
};

const MyJourneysTab = ({
  journeys = [],
  onCancelJourney,
  isLoading,
  onEditJourney,
}: MyJourneysTabProps) => {
  return (
    <TabPanel value="JOURNEYS">
      {isLoading ? (
        <CircularLoading />
      ) : (
        journeys.map((journey, index) => {
          const {
            user: { profilePicture, firstname },
            origin,
            destination,
            departureTime,
            availableSeats,
            price,
            bookings,
            id,
            status,
          } = journey;
          return (
            <Card
              key={index}
              className="flex items-center mb-4 p-4 m-auto w-1/2"
            >
              <Avatar alt="profile picture" src={profilePicture ?? ""} />

              <CardContent className="flex-grow">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="h6"
                    component="h6"
                    className="font-semibold"
                  >
                    {firstname}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-sm"
                  >
                    {formattedTime(departureTime)}
                    <br />
                    Départ : {formattedDate(departureTime)}
                  </Typography>
                  <div className="flex flex-col items-center justify-evenly gap-2 m-2">
                    {status === "PLANNED" && (
                      <>
                        <Button
                          className=""
                          onClick={() => onCancelJourney(id)}
                        >
                          Annuler
                        </Button>
                        {bookings.length === 0 && (
                          <Button
                            className=""
                            onClick={() => {
                              onEditJourney(id);
                            }}
                          >
                            Modifier
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  De {origin} à {destination}
                </Typography>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  Siége disponible : {availableSeats}
                </Typography>
                <Typography>Prix : {price}€</Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </TabPanel>
  );
};

export default MyJourneysTab;
