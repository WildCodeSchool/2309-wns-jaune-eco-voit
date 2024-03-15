"use client";
/* chore */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
/* Assets */
import "./globals.css";
import { gatwick, stolzl } from "./theme/ThemeOption";
import ThemeRegistery from "./theme/ThemeRegistery";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import { AuthContext, AuthProvider } from "@/context/authContext";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
    credentials: "include",
  });

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeRegistery>
          <html lang="en" className={`${stolzl.variable} ${gatwick.variable}`}>
            <body className="font-stolzl">
              <main className="min-h-screen flex flex-col justify-between">
                <Header />
                {children}
                <Footer />
              </main>
            </body>
          </html>
        </ThemeRegistery>
      </AuthProvider>
    </ApolloProvider>
  );
}
