"use client";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import localFont from "next/font/local";

//Add custom fonts
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

// Customize MUI theme
const themeOptions: ThemeOptions = {
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
};

const theme = createTheme(themeOptions);

export default function ThemeRegistery({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
