import { ThemeOptions } from "@mui/material/styles";
import localFont from "next/font/local";

//Custom fonts
export const gatwick = localFont({
  src: "../../fonts/gatwick-600.otf",
  variable: "--font-gatwick",
});

export const stolzl = localFont({
  src: [
    {
      path: "../../fonts/stolzl-400.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/stolzl-500.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/stolzl-600.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-stolzl",
});

// MUI theme
export const themeOptions: ThemeOptions = {
  palette: {
    common: {
      black: "#201F28",
      white: "#FFFFFF",
    },
    primary: {
      main: "#8D84EF",
      light: "#ABA5F3",
      dark: "#554DB4",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FDB78F",
      light: "#FFD0B6",
      dark: "#E5A682",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontSize: 15,
    fontFamily: `${stolzl}, "Helvetica", "Arial", "sans-serif"`,
    fontWeightBold: 600,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "0.55em 1.5em",
          borderRadius: ".4em",
        },
        text: ({ ownerState }) => ({
          ...(ownerState.color === "primary" && {
            backgroundColor: "#F1F0F9",
            "&:hover": {
              backgroundColor: "#EBEAF6",
            },
          }),
          ...(ownerState.color === "secondary" && {
            color: "#E5A682",
            backgroundColor: "#FFF2EB",
            "&:hover": {
              backgroundColor: "#FCE9DE",
            },
          }),
        }),
        outlined: {
          //
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
};
