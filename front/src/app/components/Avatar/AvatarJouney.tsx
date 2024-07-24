import { routes } from "@/app/lib/routes";
import { gradeFrench } from "@/app/utils/generals";
import { Grade } from "@/types/user";
import { Avatar, Rating, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";

type AvatarJourneyProps = {
  id: string;
  firstname: string;
  grade?: Grade;
  rating?: number | null;
  profilePicture?: string;
};

const AvatarJourney = ({
  id,
  firstname,
  grade,
  rating,
  profilePicture,
}: AvatarJourneyProps) => {
  const router = useRouter();

  return (
    <div className="py-4 gap-4">
      <div className="flex gap-6">
        <Tooltip title={firstname}>
          <Avatar
            alt="profile picture"
            src={profilePicture}
            className="cursor-pointer"
            sx={{ width: 70, height: 70 }}
            onClick={() => router.push(`${routes["profile"].pathname}/${id}`)}
          />
        </Tooltip>
        <div className=" flex flex-col justify-around">
          <div className="flex text-lg gap-2">
            <p className="font-semibold">{firstname}</p>
            {grade ? <p>({gradeFrench[grade]})</p> : null}
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
