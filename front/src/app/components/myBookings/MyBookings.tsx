import { formattedDate, formattedTime } from "@/app/utils/date";
import { ListBookingsByUserQuery } from "@/types/graphql";
import { TabPanel } from "@mui/lab";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import CircularLoading from "../CircularLoading/CircularLoading";

type MyBookingsTabProps = {
  bookings?: ListBookingsByUserQuery["listBookingsByUser"];
  onCancelBooking: (id: string) => void;
  isLoading: boolean;
};

const MyBookingsTab = ({
  bookings = [],
  onCancelBooking,
  isLoading,
}: MyBookingsTabProps) => {
  return (
    <TabPanel value="BOOKINGS">
      {isLoading ? (
        <CircularLoading />
      ) : (
        bookings.map(
          (
            {
              status,
              id,
              journey: {
                departureTime,
                destination,
                origin,
                user: { profilePicture, firstname },
              },
            },
            index
          ) => (
            <Card
              key={index}
              className={`flex justify-between items-center mb-4 p-4 m-auto h-full w-1/2 
            `}
            >
              <CardContent
                className={`flex-grow ${
                  status !== "ACCEPTED" ? "opacity-50" : ""
                }`}
              >
                <Avatar
                  alt="profile picture"
                  src={profilePicture ?? undefined}
                />
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
                    {formattedDate(departureTime)} <br />
                    Départ : {formattedTime(departureTime)}
                  </Typography>
                </div>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-700 whitespace-pre-wrap"
                >
                  De {origin} à {destination}
                </Typography>
              </CardContent>
              <div className="flex flex-col gap-2 justify-between items-end h-full">
                <div className="status rounded-full bg-primary100 py-1 px-2 text-xs text-white w-fit">
                  {status.toLowerCase()}
                </div>

                <Button
                  onClick={() => onCancelBooking(id)}
                  disabled={status !== "ACCEPTED"}
                >
                  Annuler
                </Button>
              </div>
            </Card>
          )
        )
      )}
    </TabPanel>
  );
};

export default MyBookingsTab;
