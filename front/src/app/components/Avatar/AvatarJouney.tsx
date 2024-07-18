import { GradeFrench } from "@/app/utils/generals";
import { Grade } from "@/types/user";
import { Avatar, Rating } from "@mui/material";

type AvatarJourneyProps = {
  firstname: string;
  grade?: Grade;
  rating?: number | null;
  profilePicture?: string;
};

const AvatarJourney = ({
  firstname,
  grade,
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
        />
        <div className=" flex flex-col justify-around">
          <div className="flex text-lg gap-2">
            <p className="font-semibold">{firstname}</p>
            {grade ? <p>({GradeFrench[grade]})</p> : null}
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
