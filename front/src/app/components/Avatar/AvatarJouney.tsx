import { Avatar, Rating } from "@mui/material";

type AvatarJourneyProps = {
  firstname: string;
  rating?: number;
  profilePicture?: string;
};

const AvatarJourney = ({
  firstname,
  rating = 4,
  profilePicture = "https://www.santelog.com/sites/santelog.com/www.santelog.com/files/styles/large/public/images/accroche/adobestock_276208008_lama.jpeg?itok=d2steNiv",
}: AvatarJourneyProps) => {
  return (
    <div className="py-4 gap-4">
      <div className="flex gap-6">
        <Avatar
          alt="profile picture"
          src={profilePicture}
          sx={{ width: 70, height: 70 }}
        />{" "}
        <div className=" flex flex-col justify-around">
          <div className="flex text-lg gap-2">
            <p className="font-semibold">{firstname}</p>
            <p>(Mercedes Benz)</p>
          </div>
          <div>
            <Rating value={rating} disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarJourney;
