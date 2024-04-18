"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useLogoutLazyQuery } from "@/types/graphql";

import { AuthContext } from "@/context/authContext";



function Logout() {
  const { contextLogout } = useContext(AuthContext);
  const router = useRouter();
  const [logout, { loading }] = useLogoutLazyQuery();

  useEffect(() => {
    contextLogout();
    logout();
    console.log('tik')
    setTimeout(() => {
    router.push("/");
    },1000)
  }, [ logout, router, contextLogout]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      {loading ? "Veuillez patienter..." : "Vous êtes déconnectés!"}
    </main>
  );
}

export default Logout;
