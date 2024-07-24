import Header from "@/app/components/layout/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { AuthContext } from "@/context/authContext";

jest.mock("next/navigation", () => ({
  ...require("next-router-mock"),
  usePathname: jest.fn().mockReturnValue("/"),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

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
