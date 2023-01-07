const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const dashBordPage = require("../fixtures/pages/dashBoardPage.json");
const mainPage = require("../fixtures/pages/mainPage.json");
const quickDrowElements = require("../fixtures/pages/quickDrowPage.json");

let cookie = "connect.sid=s%3A-yoJwYfe1GtvrcbCV4LxyYhtrw904USQ.j1nLxDaLGuUt%2Br%2Bj%2FBCC2AcocFkeI32X9H96F8nClJc";
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
  let boxKey;
  let wishes =
    faker.word.noun() +
    " " +
    faker.word.adjective() +
    " " +
    faker.word.adverb();

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);

    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxKeyField).then((key) => {
      boxKey = Cypress.$(key).val(); //Сохранение значения из поля Идентификатор в переменную boxKey
      cy.log(boxKey);
    });
    // cy.log(boxKey);
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
    cy.get(dashBordPage.toggleMenu)
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
    wishes =
      faker.word.noun() +
      " " +
      faker.word.adjective() +
      " " +
      faker.word.adverb();
    cy.creatingUserCard(wishes);
    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.goToLoginForm(inviteLink); //переход по ссылке для приглашения,переход к форме авторизации
    cy.login(users.user3.email, users.user3.password);
    wishes =
      faker.word.noun() +
      " " +
      faker.word.adjective() +
      " " +
      faker.word.adverb();
    cy.creatingUserCard(wishes);
    cy.clearCookies();
  });

  // it('quick draw start', () => {
  //   cy.visit("/login");
  //   cy.login(users.userAuthor.email, users.userAuthor.password);
  //   cy.get(mainPage.quickDrawButton).click();
  //   cy.get(generalElements.arrowRight).click();
  //   cy.get(quickDrowElements.name1thParticipant).type(users.user1.name);
  //   cy.get(quickDrowElements.email1thParticipant).type(users.user1.email)
  //   cy.get(quickDrowElements.name2thParticipant).type(users.user2.name);
  //   cy.get(quickDrowElements.email2thParticipant).type(users.user2.email)
  //   cy.get(quickDrowElements.name3thParticipant).type(users.user3.name);
  //   cy.get(quickDrowElements.email3thParticipant).type(users.user3.email)
  //   cy.get(generalElements.arrowRight).click();
  //   cy.get(generalElements.arrowRight).click();
  //   cy.get(quickDrowElements.noticeQuickDrow).should("have.text", "Жеребьевка проведена!");
  // });

  it("draw from the box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.log(boxKey);
    cy.visit(`/box/${boxKey}`);
   // cy.visit(`/box/D7keGg`);
    cy.get(quickDrowElements.goToDraw).click({force: true})
    cy.get(generalElements.submitButton).click();
    cy.get(quickDrowElements.confirmationOfDraw).click();
    cy.clearCookies();
  });
  it('checking notifications for user1', () => {
    cy.visit("/login");
    cy.login(users.user1.email, users.user1.password);
    cy.checkAndReadNotifications(newBoxName);
    cy.clearCookies();

    cy.visit("/login");
    cy.login(users.user2.email, users.user2.password);
    cy.checkAndReadNotifications(newBoxName);
    cy.clearCookies();

    cy.visit("/login");
    cy.login(users.user3.email, users.user3.password);
    cy.checkAndReadNotifications(newBoxName);
    cy.clearCookies();
  });

  after("Delete Box", () => {
    cy.request({
      method: "DELETE",
      headers: {
        Cookie: cookie,
      },
      url: `/api/box/${boxKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
