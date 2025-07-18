/// <reference types="cypress" />

describe('E2E User Journeys', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
        statusCode: 200,
        body: {},
    }).as('backtrace');
  });


  it('standard_user - purchases all 6 items', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
    cy.getDataTest('add-to-cart-sauce-labs-bolt-t-shirt').click();
    cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
    cy.getDataTest('add-to-cart-sauce-labs-onesie').click();
    cy.getDataTest('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    cy.getDataTest('shopping-cart-link').click();
    cy.getDataTest('checkout').click();
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('total-label').should('contain', '$140.34');
    cy.getDataTest('finish').click();
    cy.url().should('include', '/checkout-complete.html');
    cy.getDataTest('complete-header').should('contain', 'Thank you for your order!');
    cy.getDataTest('back-to-products').click();
    cy.url().should('include', '/inventory.html');
  })


  it('locked_out_user - login attempt', () => {
    cy.login('locked_out_user', 'secret_sauce');
    cy.getDataTest('error').should('contain', 'Epic sadface: Sorry, this user has been locked out.');
    cy.get('.svg-inline--fa.fa-times-circle').should('have.length', 2);
  })


  it.only('problem_user - add to cart and checkout issues', () => {
    cy.login('problem_user', 'secret_sauce');

  })



})