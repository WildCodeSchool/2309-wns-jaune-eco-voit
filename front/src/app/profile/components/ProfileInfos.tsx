import { UserEntity } from "@/types/graphql";
import { Avatar, Rating } from "@mui/material";

const ProfileInfos = ({ user }: { user: UserEntity }) => {
  const {
    firstname,
    lastname,
    profilePicture,
    email,
    role,
    dateOfBirth,
    tripsAsPassenger,
    tripsAsDriver,
    averageRate,
  } = user;

  return (
    <div className="profile_infos flex flex-col items-center gap-8 py-10  w-1/2 min-w-[285px] max-w-[425px]">
      <div className="profile_picture flex flex-col justify-center items-center">
        <Avatar
          alt="profile picture"
          sx={{ width: 100, height: 100 }}
          src={profilePicture ?? undefined}
        />
      </div>
      <div className="body-profile w-full flex flex-col justify-center items-center gap-6">
        <h3 className="mb-3">Informations générales</h3>
        <div className="flex w-full gap-2 border-b border-dark40 pb-4">
          <p className="text-dark60">Prénom : </p>
          <p>{firstname}</p>
        </div>
        <div className="flex w-full gap-2 border-b border-dark40 pb-4">
          <p className="text-dark60">Nom : </p>
          <p>{lastname}</p>
        </div>
        <div className="flex w-full gap-2 border-b border-dark40 pb-4">
          <p className="text-dark60">Email : </p>
          <p>{email}</p>
        </div>
        <div className="flex w-full gap-2 border-b border-dark40 pb-4">
          <p className="text-dark60">Date naissance : </p>
          <p>{dateOfBirth ?? "non renseigné"}</p>
        </div>
      </div>
      <div className="Journey_count flex flex-col justify-center items-center gap-2 w-full">
        <h3 className="mb-3">Trajets effectués</h3>
        <div className="flex gap-4 w-full">
          <p className="rounded-lg w-1/2 bg-primary100 text-white px-4 py-3 text-center">
            Passager
            <br />
            {tripsAsPassenger}
          </p>
          <p className="rounded-lg w-1/2 bg-primary100 text-white px-4 py-3 text-center">
            Conducteur
            <br />
            {tripsAsDriver}
          </p>
        </div>
      </div>
      <div className="Rate w-full bg-primary20 rounded-lg py-6 px-12 flex flex-col justify-center items-center gap-2">
        <h3 className="mb-1">Note moyenne</h3>
        <Rating value={averageRate} disabled />
      </div>
    </div>
  );
};

export default ProfileInfos;
