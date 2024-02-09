import { Login } from "@/app/ecovoit/login/login";
import { render, screen } from "@testing-library/react";

describe("Vérification de l'affichage", () => {
    it("", () => {
        render(<Login/>);

        const titre = screen.getByText('Connexion');

        expect(titre).toBeInTheDocument();

    })
})