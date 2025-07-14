/// <reference types="cypress" />

describe('Sauce Cart Page', () => {
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

  it('Add backpack to cart and verify it was added', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('not.exist');
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
  });

  it('Remove backpack from cart and verify it was removed', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('not.exist');
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('Add items to cart and navigate to cart page to verify', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.contains('Your Cart');
    cy.get('[data-test="inventory-item"]').should('have.length', 2);
    cy.get('[data-test="inventory-item"]').eq(1).contains('Test.allTheThings() T-Shirt (Red)');
  });

  it('Verify the URL path', () => {
    cy.location('pathname').should('eq', '/inventory.html');
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.location('pathname').should('eq', '/cart.html');
    cy.go('back');
    cy.location('pathname').should('eq', '/inventory.html');
  })

  it('Use an alias to add and remove the bike light', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').as('addLight');
    cy.get('@addLight').click();
    cy.get('[data-test="remove-sauce-labs-bike-light"]').as('removeLight');
    cy.get('@removeLight').contains('Remove').should('be.visible');
    cy.get('@addLight').should('not.exist');
    cy.get('@removeLight').click();
    cy.get('@addLight')
      .contains('Add to cart')
      .should('be.visible');
    cy.get('@removeLight').should('not.exist');
  })

  



})