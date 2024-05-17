"use client";
//cores
import { useState, useContext, SetStateAction } from "react";
import { useRouter } from "next/navigation";
//graphQL
import { LoginInput, useLoginLazyQuery } from "@/types/graphql";
//
import { TextField, Stack, Typography, FormControl, Link } from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";
import { routes } from "@/app/lib/routes";
import { AuthContext } from "@/context/authContext";
import PasswordInput from "@/app/components/Profile/PasswordInput";
import CardButton from "@/app/components/Buttons/CardButton";
import ConnexionCard from "@/app/components/Profile/ConnexionCard";

const Login = () => {
  const theme = useTheme();
  const router = useRouter();
  const [login] = useLoginLazyQuery({
    onCompleted(data) {
      updateUser(data.login.id);
      setTimeout(() => {
        router.push(routes.home.pathname);
      }, 1000);
    },
    onError(error) {
      setLoginError(error.message);
    },
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  const { updateUser } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { email, password } = Object.fromEntries(formData) as LoginInput;

    if (!email && !password) {
      setLoginError("L'email et le mot de passe sont obligatiores");
      return;
    }

    login({
      variables: { data: { email, password } },
    });
  };

  return (
    <ConnexionCard title="Connexion">
      <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
        Vous n&apos;avez pas de compte ?
        <Link
          href={routes.register.pathname}
          variant="body2"
          sx={{
            color: alpha(theme.palette.primary.main, 0.8),
            textDecoration: "underline",
            ml: 2,
          }}
        >
          Créer son compte
        </Link>
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl>
            <TextField name="email" label="Email" />
          </FormControl>
          <FormControl>
            <PasswordInput name="password" label="Mot de passe" />
          </FormControl>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ my: 3 }}
        >
          <Typography variant="subtitle2">
            <Link
              href="/"
              variant="body2"
              sx={{
                color: alpha(theme.palette.primary.main, 0.8),
                textDecoration: "underline",
              }}
            >
              Mot de passe oublié?
            </Link>
          </Typography>
        </Stack>

        <CardButton>Se connecter</CardButton>
      </form>
      {loginError && (
        <Typography variant="body2" color="error">
          {loginError}
        </Typography>
      )}
    </ConnexionCard>
  );
};

export default Login;
