"use client";

import { REGISTER } from "@/requetes/mutations/auth.mutations";
import {
  RegisterInput,
  RegisterMutation,
  RegisterMutationVariables,
} from "@/types/graphql";
import { useMutation } from "@apollo/client";

import{ Box, Container, TextField, Card, Stack, Button, Typography, IconButton, InputAdornment, FormControl, Link, Divider} from '@mui/material';
import { TextFieldProps } from '@mui/material';

import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { useState, useEffect } from "react";



// utils pour la confirmation mdp / email

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register () {
    const router = useRouter();
    const theme = useTheme();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

     const [loginError, setLoginError] = useState<string | null>(null);

    const [validEmail, setValidEmail] = useState(false);

    const [register, {error}] = useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(REGISTER, {
    onCompleted(data) {
      console.log(data.register);
      router.push("/auth/login");
    },
    onError(error) {
      console.log(error);
    },
  });

  

  //   useEffect(() => {
  //   setPasswordsMatch(PWD_REGEX.test(password));
  //   setValidPassword(password === confirmPassword);
  // }, [password, confirmPassword]);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setLoginError("Les mots de passe ne correspondent pas")
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as RegisterInput;
    console.log('data', data);

    if (data.email && data.password && data.firstname && data.lastname && data.dateOfBirth) {
      const birthdate = dayjs(data.dateOfBirth, 'DD/MM/YYYY').toISOString();
      console.log('birthdate', birthdate)
      register({
        variables: { infos: { email: data.email, password: data.password, firstname: data.firstname, lastname: data.lastname, dateOfBirth: birthdate } },
      });
      setPassword('')
      setConfirmPassword('')
      setLoginError("");
    }else{
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
          <Typography variant="h4" align="center">Inscription</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{my: 2}}>
              <FormControl>
                <TextField name="email" label="Email" />
              </FormControl>
              <FormControl>
                <TextField
                  name="password"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
               <FormControl>
                <TextField
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!passwordsMatch}
                  helperText={!passwordsMatch && "Les mots de passe ne correspondent pas"}
                />
              </FormControl>
              <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.4) }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <FormControl>
                  <TextField name="firstname" label="Prénom" />
                </FormControl>
                <FormControl>
                  <TextField name="lastname" label="Nom" />
                </FormControl>
              </Stack>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                  <DatePicker 
                    name="dateOfBirth" 
                    label="Date de naissance"
                    />
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
           {loginError && <Typography variant="body2" color="error" sx={{mt:2}}>{loginError}</Typography>}
        </Card>
      </Stack>
    </Container>
    
  )
}

export default Register;