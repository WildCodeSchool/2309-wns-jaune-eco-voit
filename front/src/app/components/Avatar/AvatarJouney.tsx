import { Avatar, Rating } from "@mui/material";

type AvatarJourneyProps = {
  firstname: string;
  rating?: number | null;
  profilePicture?: string;
};

const AvatarJourney = ({
  firstname,
  rating,
  profilePicture,
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
          {rating && (
            <div>
              <Rating value={rating} disabled />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarJourney;
