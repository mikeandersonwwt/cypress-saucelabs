/// <reference types="cypress" />

describe('Sauce Inventory Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');

    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('Inventory page validation', () => {
    cy.get('[data-test="header-container"]').contains('Swag Labs');
  });

  it('Shopping cart icon exists', () => {
    cy.get('[data-test="shopping-cart-link"]').should('exist');
  });

  it('Inventory has 6 items', () => {
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('Inventory includes a onesie', () => {
    cy.get('[data-test="inventory-item-sauce-labs-onesie-img"]').should('be.visible');
  });





})