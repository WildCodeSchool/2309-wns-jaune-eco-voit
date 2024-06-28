describe("Journey publish page", () => {
  it("Publish journey", () => {
    /*------ Login ------*/
    cy.visit("/auth/login");
    cy.url().should("eq", "http://localhost:3003/auth/login");

    cy.get("input[name='email']").type("sakogm38@gmail.com");
    cy.get("input[name='password']").type("sakogm38");
    cy.get("button").contains("Se connecter").click();

    cy.url().should("eq", "http://localhost:3003/");

    /*------ Journey publish page ------*/
    cy.get("p").contains("Publier un trajet").parent().click();
    cy.url().should("eq", "http://localhost:3003/journey/publish");

    /*------ Step1 ------*/
    cy.get("h3").contains("D'où partez-vous?");
    cy.get("label").contains("Point de départ"); // Correction de "départ" pour "départ"

    cy.get("label")
      .contains("Point de départ") // Correction de "départ" pour "départ"
      .next("div")
      .find("input")
      .type("Paris");

    // button "Suivant" must be disabled if we don't have value in input
    cy.get("button").contains("Suivant").should("be.disabled");
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.get("button").contains("Suivant").click();

    /*------ Step2 ------*/
    cy.get("h3").contains("Où allez-vous?");
    cy.get("label").contains("Point d'arrivée");

    cy.get("label")
      .contains("Point d'arrivée")
      .next("div")
      .find("input")
      .type("Grenoble");

    // button "Suivant" must be disabled if we don't have value in input
    cy.get("button").contains("Suivant").should("be.disabled");
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.get("button").contains("Suivant").click();

    /*------ Step3 ------*/
    cy.get("h3").contains("Choisissez la date de votre départ");
    cy.get("button[title='Next month']").click();
    cy.get("div[role='row']").find("button").eq(0).click();
    cy.get("button").contains("Suivant").click();

    /*------ Step4 ------*/
    cy.get("h3").contains("Choisissez l'heure de votre départ");
    cy.get("button").contains("Suivant").click();

    /*------ Step5 ------*/
    cy.get("h3").contains("Combien de passagers acceptez-vous?");

    // Initial value = 1
    cy.get("input").should("have.value", "1");

    cy.get("input").click().type("{selectall}7");
    cy.get("button").contains("+").click().click();
    // Max value must not exceed 8
    cy.get("input").should("have.value", "8");

    cy.get("button").contains("Suivant").click();

    /*------ Step6 ------*/
    cy.get("h3").contains("Fixez le prix par passager");

    // Initial value = 0
    cy.get("input").should("have.value", "0");
    // button "Suivant" must be disabled if input value is 0
    cy.get("button").contains("Suivant").should("be.disabled");

    cy.get("input").type("{selectall}35").should("have.value", "35");

    cy.get("button").contains("Suivant").click();

    /*------ Step7 ------*/
    cy.get("h3").contains("Activer la réservation automatique?");
    cy.get("input.PrivateSwitchBase-input").click().should("not.be.checked");

    // Intercept the API call and respond with the fixtures
    cy.fixture("createJourneyInput.json").then((input) => {
      cy.fixture("createJourneyOutput.json").then((output) => {
        cy.intercept("POST", "http://localhost:4000", (req) => {
          req.body = input;

          req.reply({
            statusCode: 200,
            body: output,
          });
        }).as("CreateJourneyResponse");
      });
    });

    cy.get("button").contains("Terminer").click();

    // Wait for the intercepted call to complete
    cy.wait("@CreateJourneyResponse");

    /*------ Validation step ------*/
    cy.contains("Félicitations, votre trajet est en ligne!").should(
      "be.visible"
    );
    cy.wait(1500); // Si possible, évitez d'utiliser des wait fixes, préférez attendre des éléments spécifiques
    cy.url().should(
      "eq",
      "http://localhost:3003/journey/96efab94-d728-4940-8ab0-2bb3de8a2dc6"
    );
  });
});
