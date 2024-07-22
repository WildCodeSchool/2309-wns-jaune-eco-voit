import { Grid } from "@mui/material";
import JourneyCardHeader from "./JourneyCardHeader";
import AvatarJourney from "../Avatar/AvatarJouney";
import JourneyCardFooter from "./JourneyCardFooter";
import { routes } from "@/app/lib/routes";
import Link from "next/link";

type User = {
  firstname: string;
  id: string;
  averageRate?: number | null;
  profilePicture?: string | null;
};

type JourneyCardProps = {
  departureTime: Date;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  user: User;
  id: string;
};

const JourneyCard = ({
  departureTime,
  origin,
  destination,
  price,
  availableSeats,
  user: { firstname, id: userId, averageRate, profilePicture },
  id,
}: JourneyCardProps) => {
  return (
    <Grid item sm={10} md={5}>
      <Link
        href={`${routes.journey.pathname}/${id}`}
        className="flex flex-col rounded-2xl bg-white p-6 gap-6 hover:shadow-xl transition duration-300 ease-in-out"
      >
        <JourneyCardHeader
          departureTime={departureTime}
          origin={origin}
          destination={destination}
        />
        <AvatarJourney
          id={userId}
          firstname={firstname}
          rating={averageRate}
          profilePicture={profilePicture ?? undefined}
        />
        <JourneyCardFooter price={price} availableSeats={availableSeats} />
      </Link>
    </Grid>
  );
};

export default JourneyCard;
