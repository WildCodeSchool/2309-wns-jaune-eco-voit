import Header from "@/app/components/layout/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_PROFILE } from "@/requetes/queries/user.queries";
import { AuthContext } from "@/context/authContext";

jest.mock("next/navigation", () => require("next-router-mock"));

describe("Header", () => {
  it("should display connexion button if user is not connected", () => {
    render(
      <MockedProvider>
        <Header />
      </MockedProvider>
    );

    const connexion = screen.getByText("Connexion");

    expect(connexion).toBeInTheDocument();
  });

  it("should display 'add journey' button if user is connected", async () => {
    render(
      <AuthContext.Provider
        value={{
          getUser: "vlavkabla",
          user: "laev",
          updateUser: () => null,
          contextLogout: () => null,
        }}
      >
        <MockedProvider>
          <Header />
        </MockedProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Publier un trajet")).toBeInTheDocument();
  });
});
