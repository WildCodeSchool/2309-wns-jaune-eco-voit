"use client";

import { LOGIN } from "@/requetes/queries/auth.queries";
import {
  LoginInput,
  LoginQuery,
  useLoginLazyQuery,
  LoginQueryVariables,
} from "@/types/graphql";
import { useLazyQuery } from "@apollo/client";

import { FormEvent, useState } from "react";

import {
  Box,
  Container,
  TextField,
  Card,
  Stack,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  Link,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { routes } from "@/app/lib/routes";

const Login = () => {
  const theme = useTheme();
  const router = useRouter();
  const [login, { data, error }] = useLoginLazyQuery();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as LoginInput;
    console.log("data", data);
    if (data.email && data.password) {
      login({
        variables: { data: { email: data.email, password: data.password } },
        onCompleted(data) {
          console.log(data.login);
          router.push(routes.home.pathname);
          if (!data.login.success) {
            setLoginError(data.login.message);
            return;
          }
          setLoginError(null);
        },
      });
    }
  };

  return (
    <Container>
      <Box
        my={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={4}
        p={2}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4" align="center">
              Connexion
            </Typography>

            <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
              Vous n&apos;avez pas de compte ?
              <Link
                href="/auth/register"
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
                  <TextField
                    name="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? "a" : "b"}
                            {/* Remplacer a et b par component d'icon après le choix du module d'icone */}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!email || !password}
              >
                Se connecter
              </Button>
            </form>
            {loginError && (
              <Typography variant="body2" color="error">
                {loginError}
              </Typography>
            )}
          </Card>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
