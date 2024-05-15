"use client";
/* chore */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
/* Assets */
import "./globals.css";
import { gatwick, stolzl } from "./theme/ThemeOption";
import ThemeRegistery from "./theme/ThemeRegistery";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import {  LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";


import { AuthProvider } from "@/context/authContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_APOLLO_CLIENT_URI}`,
    cache: new InMemoryCache(),
    credentials: "include",
  });

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeRegistery>
          <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="fr"
                >
          <html lang="en" className={`${stolzl.variable} ${gatwick.variable}`}>
            <body className="font-stolzl">
              <main className="min-h-screen flex flex-col justify-between">
                <Header />
                {children}
                <Footer />
              </main>
            </body>
          </html>
          </LocalizationProvider>
        </ThemeRegistery>
      </AuthProvider>
    </ApolloProvider>
  );
}
