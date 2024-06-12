import { Grid } from "@mui/material";
import JourneyCardHeader from "./JourneyCardHeader";
import AvatarJourney from "../Avatar/AvatarJouney";
import JourneyCardFooter from "./JourneyCardFooter";
import { routes } from "@/app/lib/routes";
import Link from "next/link";
import { JourneyEntity, UserEntity } from "@/types/graphql";

type User = {
  averageRate?: number | null;
  profilePicture?: string;
  firstname: string;
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
  console.log("average", user.averageRate);
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
          firstname={user.firstname}
          rating={user.averageRate ? user.averageRate : undefined}
          profilePicture={
            user.profilePicture ??
            "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv"
          }
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
