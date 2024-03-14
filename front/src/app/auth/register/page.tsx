"use client";

import { CreateUserInput, useRegisterMutation } from "@/types/graphql";

import {
  Container,
  TextField,
  Card,
  Stack,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  Divider,
  Avatar,
} from "@mui/material";

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';



import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { alpha, useTheme } from "@mui/material/styles";

import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { useEffect, useState } from "react";
import { routes } from "@/app/lib/routes";

// utils pour la confirmation mdp / email
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  const router = useRouter();
  const theme = useTheme();


  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show); 
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const [loginError, setLoginError] = useState<string | null>(null);

  const [validEmail, setValidEmail] = useState(false);

  const [register, { error }] = useRegisterMutation({
    onCompleted(data) {
      router.push(routes.login.pathname);
      console.log(data);
    },
     onError(error) {
      console.log(error);
      setLoginError(error.message);
    },
  });

  // useEffect(() => {
  //   if (confirmPassword !== "" && password !== "") {
  //     setPasswordsMatch(PWD_REGEX.test(password));
  //     setValidPassword(password === confirmPassword);
  //   }
  //   if (confirmPassword === "" || password === "") {
  //     setPasswordsMatch(false);
  //     setValidPassword(false);
  //   }
  // }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setLoginError("Les mots de passe ne correspondent pas");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as CreateUserInput;
    console.log("data", data);

    if (
      data.email &&
      data.password &&
      data.firstname &&
      data.lastname &&
      data.dateOfBirth
    ) {
      const birthdate = dayjs(data.dateOfBirth, "DD/MM/YYYY").toISOString();

      register({
        variables: {
          data: {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            dateOfBirth: birthdate,
          },
        },
      });
      setPassword("");
      setConfirmPassword("");
      setLoginError("");
    } else {
      setLoginError("Veuillez remplir tous les champs");
    }
  };

  return (
    <Container>
      <Stack
        my={4}
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={4}
        p={2}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" align="center">
            Inscription
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <FormControl>
                <TextField name="email" label="Email" />
              </FormControl>
              <FormControl>
                <TextField
                  name="password"
                  label="Mot de passe"
                   type={showPassword ? "text" : "password"}
                  value={password}
                  InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                           {showPassword ? <VisibilityOutlinedIcon color="primary"/> : <VisibilityOffOutlinedIcon color="primary" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <TextField
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!passwordsMatch}
                  helperText={
                    !passwordsMatch
                      ? "Les mots de passe ne correspondent pas"
                      : null
                  }
                />
              </FormControl>
              <Divider
                sx={{ borderColor: alpha(theme.palette.divider, 0.4) }}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <FormControl>
                  <TextField name="firstname" label="Prénom" />
                </FormControl>
                <FormControl>
                  <TextField name="lastname" label="Nom" />
                </FormControl>
              </Stack>
              <FormControl>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="fr"
                >
                  <DatePicker name="dateOfBirth" label="Date de naissance" />
                </LocalizationProvider>
              </FormControl>
            </Stack>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              S&apos;inscrire
            </Button>
          </form>
          {loginError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {loginError}
            </Typography>
          )}
        </Card>
      </Stack>
    </Container>
  );
}

export default Register;
