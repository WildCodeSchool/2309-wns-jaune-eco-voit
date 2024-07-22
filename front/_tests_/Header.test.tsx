import Header from "@/app/components/layout/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_PROFILE } from "@/requetes/queries/user.queries";
import { AuthContext } from "@/context/authContext";

// jest.mock("next/navigation", () => require("next-router-mock"));
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

const mocks = [
  {
    request: {
      query: GET_PROFILE,
    },
    result: {
      data: {
        getProfile: {
          role: "USER",
          lastname: "marie-lou",
          id: "2871869b-b933-4f9b-bcdd-1c16477be54c",
          firstname: "le jan",
          email: "marielou.lejan@gmail.com",
        },
      },
    },
  },
];

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
        <MockedProvider mocks={mocks} addTypename={false}>
          <Header />
        </MockedProvider>
      </AuthContext.Provider>
    );

    const connexion = screen.queryByText("Connexion");
    console.log(connexion);

    expect(screen.getByText("Publier un trajet")).toBeInTheDocument();

    expect(connexion).not.toBeInTheDocument();
  });
});
