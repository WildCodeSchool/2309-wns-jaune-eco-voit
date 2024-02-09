"use client";
import { LoginInput, useLoginLazyQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export const Login = () => {
  const router = useRouter();
  const [login, { data, error }] = useLoginLazyQuery();
  const [loginError, setLoginError] = useState("");

  // Utiliser react hook form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as LoginInput;
    if (data.email && data.password) {
      login({
        variables: { data: { email: data.email, password: data.password } },
        onCompleted(data) {
          if (!data.login.success) {
            setLoginError("Vérifiez vos informations");
            return;
          }
          router.push("/");
        },
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="font-bold text-lg mb-8">Connexion</h1>
        <div>
          <input type="text" name="email" placeholder="Indiquez votre email" />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Indiquez votre mot de passe"
          />
        </div>
        <input type="submit" />
        {loginError && loginError}
      </form>
    </div>
  );
};
