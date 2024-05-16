import { Grid } from "@mui/material";
import JourneyCardHeader from "./JourneyCardHeader";
import AvatarJourney from "../Avatar/AvatarJouney";
import JourneyCardFooter from "./JourneyCardFooter";
import { routes } from "@/app/lib/routes";
import Link from "next/link";

type User = {
  firstname: string;
  rating?: number;
  profilePicture?: string;
};

type JourneyCardProps = {
  departureTime: Date;
  origin: string;
  destination: string;
  totalPrice: number;
  availableSeats: number;
  user: User;
  id: string;
};

const JourneyCard = ({
  departureTime,
  origin,
  destination,
  totalPrice,
  availableSeats,
  user,
  id,
}: JourneyCardProps) => {
  return (
    <Grid item sm={10} md={5}>
      <Link
        href={`${routes.journey.pathname}/${id}`}
        className="flex flex-col rounded-2xl bg-white p-6 gap-6"
      >
        <JourneyCardHeader
          departureTime={departureTime}
          origin={origin}
          destination={destination}
        />

        <AvatarJourney
          firstname={user.firstname}
          rating={user.rating}
          profilePicture={user.profilePicture}
        />
        <JourneyCardFooter
          totalPrice={totalPrice}
          availableSeats={availableSeats}
        />
      </Link>
    </Grid>
  );
};

export default JourneyCard;
