"use client";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";
import { useEffect, useState } from "react";
import ProfileInfos from "../components/ProfileInfos";
import Error from "@/app/error";
import { UserEntity, useFindUserByIdQuery } from "@/types/graphql";

const Profile = ({ params }: { params: { id: string } }) => {
  const { id: userId } = params;
  const { data, loading, error } = useFindUserByIdQuery({
    variables: {
      findUserById: userId,
    },
  });

  const [user, setUser] = useState<UserEntity | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setUser(data.findUserById as UserEntity);
    }
  }, [data]);

  if (loading) return <CircularLoading />;

  if (error) return <Error />;
  return (
    <div className="flex justify-center">
      {user && <ProfileInfos user={user} />}
    </div>
  );
};

export default Profile;
