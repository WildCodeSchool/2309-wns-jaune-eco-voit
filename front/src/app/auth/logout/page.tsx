"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useLogoutLazyQuery } from "@/types/graphql";

import { AuthContext } from "@/context/authContext";
import { CircularProgress } from "@mui/material";
import CircularLoading from "@/app/components/CircularLoading/CircularLoading";

function Logout() {
  const { contextLogout } = useContext(AuthContext);
  const router = useRouter();

  const [logout, { loading }] = useLogoutLazyQuery({
    onCompleted: () => contextLogout(),
  });

  useEffect(() => {
    logout();
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, [logout, router, contextLogout]);

  if (loading) {
    return <CircularLoading />;
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      Vous êtes déconnecté!
    </main>
  );
}

export default Logout;
