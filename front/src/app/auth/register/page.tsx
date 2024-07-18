"use client";

import { CreateUserInput, useRegisterMutation } from "@/types/graphql";

import {
  TextField,
  Stack,
  Typography,
  FormControl,
  Divider,
} from "@mui/material";

import dayjs from "dayjs";
import "dayjs/locale/fr";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { alpha, useTheme } from "@mui/material/styles";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { routes } from "@/app/lib/routes";
import PasswordInput from "@/app/components/Profile/PasswordInput";
import CardButton from "@/app/components/Buttons/CardButton";
import ConnexionCard from "@/app/components/Profile/ConnexionCard";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

function Register() {
  const router = useRouter();
  const theme = useTheme();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const [loginError, setLoginError] = useState<string | null>(null);

  const [register] = useRegisterMutation({
    onCompleted() {
      router.push(routes.login.pathname);
      resetValues();
    },
    onError(error: any) {
      setLoginError(error.message);
    },
  });

  const resetValues = () => {
    setNewPassword("");
    setConfirmNewPassword("");
    setLoginError("");
  };

  const checkIfPasswordMatch = (): boolean => {
    const match = newPassword === confirmNewPassword;
    if (!match) {
      resetValues();
      setPasswordsMatch(false);
    }
    return match;
  };
  const checkEmailValidity = (email: string): boolean => {
    setEmailValid(EMAIL_REGEX.test(email));
    return EMAIL_REGEX.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!checkIfPasswordMatch()) return;

    const formData = new FormData(e.currentTarget);
    const { email, password, firstname, lastname, dateOfBirth } =
      Object.fromEntries(formData) as CreateUserInput;

    if (!checkEmailValidity(email)) {
      setEmailValid(false);
      return;
    }

    if (email && password && firstname && lastname && dateOfBirth) {
      register({
        variables: {
          data: {
            email,
            password,
            firstname,
            lastname,
            dateOfBirth: dayjs(dateOfBirth, "DD/MM/YYYY").toISOString(),
          },
        },
      });
    } else {
      setLoginError("Veuillez remplir tous les champs");
    }
  };

  return (
    <ConnexionCard title="Inscription">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ my: 2 }}>
          <FormControl>
            <TextField
              name="email"
              label="Email"
              error={!emailValid}
              helperText={!emailValid && "Email invalide"}
              onChange={() => setEmailValid(true)}
            />
          </FormControl>
          <FormControl>
            <PasswordInput
              name="password"
              label="Mot de passe"
              value={newPassword}
              onChangeFn={(e) => {
                setPasswordsMatch(true);
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <PasswordInput
              name="confirmPassword"
              label="Confirmez le mot de passe"
              value={confirmNewPassword}
              onChangeFn={(e) => {
                setPasswordsMatch(true);
                setConfirmNewPassword(e.target.value);
              }}
              error={
                !passwordsMatch
                  ? "Les mots de passe ne correspondent pas"
                  : undefined
              }
            />
          </FormControl>
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.4) }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <FormControl>
              <TextField name="firstname" label="Prénom" />
            </FormControl>
            <FormControl>
              <TextField name="lastname" label="Nom" />
            </FormControl>
          </Stack>
          <FormControl>
            <DatePicker name="dateOfBirth" label="Date de naissance" />
          </FormControl>
        </Stack>
        <CardButton>S&apos;inscrire</CardButton>
      </form>
      {loginError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {loginError}
        </Typography>
      )}
    </ConnexionCard>
  );
}

export default Register;
