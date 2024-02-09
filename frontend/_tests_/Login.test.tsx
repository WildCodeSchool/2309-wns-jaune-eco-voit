import { Login } from "@/app/ecovoit/login/login";
import { render, screen } from "@testing-library/react";

describe("Vérification de l'affichage", () => {
  it("Affiche la page de connexion", () => {
    render(<Login />);

    const titre = screen.getByText("Connexion");

    expect(titre).toBeInTheDocument();
  });
});
