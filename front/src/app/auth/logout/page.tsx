"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogoutLazyQuery } from "@/types/graphql";

function Logout() {
  const router = useRouter();
  const [logout, { loading, data }] = useLogoutLazyQuery();

  useEffect(() => {
    logout();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {loading ? "Veuillez patienter..." : "Vous êtes déconnectés!"}
    </main>
  );
}

export default Logout;