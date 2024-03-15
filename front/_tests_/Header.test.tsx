import Header from "@/app/components/layout/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";


describe("Header", () => {
    it("rendu de l'affichage du header", () => {
        render(<Header/>);

        const connexion = screen.getByText('Connexion');

        expect(connexion).toBeInTheDocument();
    })
})