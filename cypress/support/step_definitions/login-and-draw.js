import { Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const dashBordPage = require("../../fixtures/pages/dashBoardPage.json");
const mainPage = require("../../fixtures/pages/mainPage.json");
const quickDrowElements = require("../../fixtures/pages/quickDrowPage.json");
const inviteeDashBoardPage = require("../../fixtures/pages/inviteeDashBoardPage.json");

let cookie =
  "connect.sid=s%3A-yoJwYfe1GtvrcbCV4LxyYhtrw904USQ.j1nLxDaLGuUt%2Br%2Bj%2FBCC2AcocFkeI32X9H96F8nClJc";
import { faker } from "@faker-js/faker";

let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let boxKey;
let wishes =
  faker.word.noun() + " " + faker.word.adjective() + " " + faker.word.adverb();

Given("user is on secter santa website", function () {
  cy.visit("/login");
});

When("user logs in as {string} and {string}", function (login, password) {
    cy.login(login, password);
    });

When("user logs in with table", function (dataTable) {
  cy.login(dataTable.hashes()[0].login, dataTable.hashes()[0].password);
});

Then("user is on dashboard page", function () {
  cy.contains("Создать коробку").click();
});

When("user fills in the fields to create a box", function () {
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(boxPage.boxKeyField).then((key) => {
    boxKey = Cypress.$(key).val(); //Сохранение значения из поля Идентификатор в переменную boxKey
    // cy.log(boxKey);
  });
  cy.get(generalElements.arrowRight).click();

  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();

  cy.get(boxPage.giftPriceToggel).check({ force: true });
  cy.get(boxPage.maxAmount).type(maxAmount);
  cy.get(boxPage.currency).select(currency);
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.layoutSelector).click("left"); //клик вне формы
  cy.get(generalElements.arrowRight).click();
});

Then("box has the correct name", function () {
  cy.get(dashBordPage.createdBoxName).should("have.text", newBoxName);
});

Then("top menu has the right items", function () {
  cy.get(dashBordPage.toggleMenu)
    .invoke("text")
    .then((text) => {
      cy.log(text);
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});
When("api request to remove the box", function () {
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
Given("user copies invitation link", function () {
  cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
});

When("user creates a wishCrad", function () {
  cy.creatingUserCard(wishes);
});

Then("block with a chat with santa appears", function () {
  cy.get(inviteeDashBoardPage.noticeForInvitee)
  .invoke("text")
  .then((text) => {
    expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
  });
});

Given("user follows the link - invitation", function () {
  cy.goToLoginForm(inviteLink);
});

Given("user logs out", function () {
  cy.clearCookies();
});


When("user makes a quick draw", function () {
  cy.get(mainPage.quickDrawButton).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(quickDrowElements.name1thParticipant).type(users.user1.name);
    cy.get(quickDrowElements.email1thParticipant).type(users.user1.email)
    cy.get(quickDrowElements.name2thParticipant).type(users.user2.name);
    cy.get(quickDrowElements.email2thParticipant).type(users.user2.email)
    cy.get(quickDrowElements.name3thParticipant).type(users.user3.name);
    cy.get(quickDrowElements.email3thParticipant).type(users.user3.email)
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
});
Then("notification of the end of the draw", function () {
  cy.get(quickDrowElements.noticeQuickDrow).should("have.text", "Жеребьевка проведена!");
});

When("user makes a draw from the box", function () {
  cy.visit(`/box/${boxKey}`);
   cy.get(quickDrowElements.goToDraw).click({force: true})
   cy.get(generalElements.submitButton).click();
   cy.get(quickDrowElements.confirmationOfDraw).click();
});

Then("number of participants is 3", function () {
  cy.get(quickDrowElements.countOfusersCardPic).should("have.length", 3)
});

Given("user read all notification", function () {
  cy.get(mainPage.readNotifications).click(); //отметить все уведомления прочитанными
});

When("user check notifications", function () {
  cy.get(mainPage.notifications).click();
});

Then("need notification exists", function () {
  cy.get(mainPage.notificationMessage).should("have.text", `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`)
});


