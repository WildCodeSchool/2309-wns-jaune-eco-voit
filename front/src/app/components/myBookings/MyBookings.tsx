import { formattedDate, formattedTime } from "@/app/utils/date";
import { ListBookingsByUserQuery } from "@/types/graphql";
import { TabPanel } from "@mui/lab";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import CircularLoading from "../CircularLoading/CircularLoading";

type MyBookingsTabProps = {
  bookings?: ListBookingsByUserQuery;
  onCancelBooking: (id: string) => void;
  isLoading: boolean;
};

const MyBookingsTab = ({
  bookings,
  onCancelBooking,
  isLoading,
}: MyBookingsTabProps) => {
  return (
    <TabPanel value="BOOKINGS">
      {isLoading ? (
        <CircularLoading />
      ) : (
        bookings?.listBookingsByUser.map((booking, index) => (
          <Card
            key={index}
            className={`flex justify-between items-center mb-4 p-4 m-auto h-full w-1/2 
            `}
          >
            <CardContent
              className={`flex-grow ${
                booking.status !== "ACCEPTED" ? "opacity-50" : ""
              }`}
            >
              <Avatar
                alt="profile picture"
                src={booking?.journey?.user?.profilePicture ?? ""}
              />
              <div className="flex items-center justify-between">
                <Typography
                  variant="h6"
                  component="h6"
                  className="font-semibold"
                >
                  {booking?.journey?.user?.firstname}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-sm"
                >
                  {formattedDate(booking?.journey?.departure_time)} <br />
                  Départ : {formattedTime(booking?.journey?.departure_time)}
                </Typography>
              </div>
              <Typography
                variant="body1"
                className="mt-2 text-gray-700 whitespace-pre-wrap"
              >
                De {booking.journey.origin} à {booking.journey.destination}
              </Typography>
              <Typography
                variant="body1"
                className="mt-2 text-gray-700 whitespace-pre-wrap"
              >
                Siége disponible : {booking.journey.availableSeats}
              </Typography>
              <Typography>Prix : {booking.journey.totalPrice}€</Typography>
            </CardContent>
            <div className="flex flex-col gap-2 justify-between items-end h-full">
              <div className="status rounded-full bg-primary100 py-1 px-2 text-xs text-white w-fit">
                {booking.status.toLocaleLowerCase()}
              </div>

              <Button
                onClick={() => onCancelBooking(booking.id)}
                disabled={booking.status !== "ACCEPTED"}
              >
                Annuler
              </Button>
            </div>
          </Card>
        ))
      )}
    </TabPanel>
  );
};

export default MyBookingsTab;
