"use client";

import Login from "@/app/auth/login/page";
import { LOGIN } from "@/requetes/queries/auth.queries";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { MockedProvider } from "@apollo/client/testing";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

jest.mock("next/router", () => ({
  ...jest.requireActual("next-router-mock"),
  push: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        data: { email: "test@yopmail.fr", password: "password" },
      },
    },
    result: {
      data: {
        login: {
          success: false,
          message: "Vérifier vos informations",
        },
      },
    },
  },
];

describe("Vérification de l'affichage", () => {
  it("Affiche la page de connexion", () => {
    const { container, getByText, getByPlaceholderText } = render(
      <MemoryRouterProvider url="/auth/login">
        <MockedProvider mocks={mocks} addTypename={false}>
          <Login />
        </MockedProvider>
      </MemoryRouterProvider>
    );

    const titre = screen.getByText("Connexion");

    expect(titre).toBeInTheDocument();
  });
});

describe("when error", () => {
  it("test error Login", async () => {
    const { container, getByText, getByPlaceholderText } = render(
      <MemoryRouterProvider url="/auth/login">
        <MockedProvider mocks={mocks} addTypename={false}>
          <Login />
        </MockedProvider>
      </MemoryRouterProvider>
    );

    fireEvent.change(getByPlaceholderText("Indiquez votre email"), {
      target: { value: "test@yopmail.fr" },
    });

    fireEvent.change(getByPlaceholderText("Indiquez votre mot de passe"), {
      target: { value: "password" },
    });

    fireEvent.submit(getByText("Connexion"));

    await waitFor(() => {
      expect(screen.getByText("Vérifiez vos informations")).toBeInTheDocument();
    });
  });
});
