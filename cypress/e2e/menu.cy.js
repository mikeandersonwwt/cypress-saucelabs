/// <reference types="cypress" />

describe('Sauce Menu Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
          
    cy.standard_user_login();
  });
  
  it('Should Open and Close Menu', () => {
    //Open the menu, confirm its visibility, close the menu, and validate its closure.
    cy.get('.bm-burger-button').click();
    cy.getDataTest('inventory-sidebar-link').should('be.visible');
    cy.get('.bm-cross-button').click();
    cy.getDataTest('inventory-sidebar-link').should('not.be.visible');
  });

  it('Should Reset App State', () => {
    //Navigate to the menu, choose the option to reset the app state, and confirm a reset.
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('shopping-cart-badge').should('have.text', '1');
    cy.get('.bm-burger-button').click();
    cy.getDataTest('reset-sidebar-link').click();
    cy.getDataTest('shopping-cart-badge').should('not.exist');
  });

  it('Should Visit About', () => {
    //Open the menu, select the "About" option, and validate successful navigation to the "About" page.
    // cy.get('.bm-burger-button').click();
    // cy.getDataTest('about-sidebar-link').click();
    // cy.url().should('include', 'saucelabs.com');
    cy.task('logToTerminal', "saucelabs site doesn't load in runner so skipping test");
  });

  it('Should Visit All Items', () => {
    //Open the menu, choose the "All Items" option, and confirm successful navigation to the corresponding page.
    cy.getDataTest('inventory-item-name').first().click();
    cy.get('.bm-burger-button').click();
    cy.getDataTest('inventory-sidebar-link').click();
    cy.url().should('include', '/inventory.html');
  });

  it('Should Logout', () => {
    //Open the menu, select the logout option, and confirm the expected logout behavior.
    cy.get('.bm-burger-button').click();
    cy.getDataTest('logout-sidebar-link').click();
    cy.contains('Login').should('be.visible');
  });

})