const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const dashBordPage = require("../fixtures/pages/dashBoardPage.json");

import { faker } from "@faker-js/faker";

describe("User can create box and run it", () => {
  //Пользователь 1 логинится
  //Пользователь 1 создаёт коробку
  //Пользователь 1 получает приглашение
  //Пользователь 2 переходит по приглашению
  //Пользователь 2 заполняет анкету о себе
  //Пользователь 3 переходит по приглашению
  //Пользователь 3 заполняет анкету
  //Пользователь 4 переходит по приглашению
  //Пользователь 4 заполняет анкету
  //Пользователь 1 логинится
  //Пользователь 1 запускает жеребьёвку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let wishes =faker.word.noun() +" " +faker.word.adjective() +" " +faker.word.adverb();

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);

    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxKeyField).then((key) => {
      const boxKey = Cypress.$(key).val(); //Сохранение значения из поля Идентификатор в переменную boxKey
      cy.log(boxKey);
    });
    cy.get(generalElements.arrowRight).click();

    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();

    cy.get(boxPage.giftPriceToggel).check({ force: true });
    // cy.get('.switch__toggle').click();
    cy.get(boxPage.maxAmount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.layoutSelector).click("left"); //клик вне формы
    cy.get(generalElements.arrowRight).click();
    // cy.get(generalElements.arrowRight).click();

    cy.get(dashBordPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        cy.log(text);
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });
  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });
  it("approve as user1", () => {
    cy.goToLoginForm(inviteLink); //переход по ссылке для приглашения,переход к форме авторизации 
    cy.login(users.user1.email, users.user1.password);
    cy.creatingUserCard(wishes);
    cy.clearCookies();
  });

  it("approve as user2", () => {
    cy.goToLoginForm(inviteLink); //переход по ссылке для приглашения,переход к форме авторизации 
    cy.login(users.user2.email, users.user2.password);
    wishes =faker.word.noun() +" " +faker.word.adjective() +" " +faker.word.adverb()
    cy.creatingUserCard(wishes);
    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.goToLoginForm(inviteLink); //переход по ссылке для приглашения,переход к форме авторизации 
    cy.login(users.user3.email, users.user3.password);
    wishes =faker.word.noun() +" " +faker.word.adjective() +" " +faker.word.adverb()
    cy.creatingUserCard(wishes);
    cy.clearCookies();
  });

  after("delete box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.get(
      '.layout-1__header-wrapper-fixed [href="/account/boxes"] > .header-item'
    ).click();
    cy.get(".user-card").first().click();
    cy.get(
      ".layout-1__header-wrapper-fixed .toggle-menu-button--inner"
    ).click();
    cy.contains("Архивация и удаление").click({ force: true });
    cy.get(":nth-child(2) > .form-page-group__main .frm").type(
      "Удалить коробку"
    );
    cy.get(".btn-service").click();
  });
});
