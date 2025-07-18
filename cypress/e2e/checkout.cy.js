/// <reference types="cypress" />

describe('Sauce Checkout Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
        
    cy.standard_user_login();
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('shopping-cart-link').click();
    cy.getDataTest('checkout').click();
  });

  it('Should Checkout and Go Back Home', () => {
    //Go through the checkout process, complete the purchase, and validate redirection to the home page.
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('finish').click();
    cy.getDataTest('back-to-products').click();
    cy.url().should('include', '/inventory.html');
  });

  it('Should Not Checkout with Empty Form', () => {
    //Initiate the checkout process with an empty form and confirm the expected system behavior.
    cy.getDataTest('continue').click();
    cy.getDataTest('error').should('contain', 'Error: First Name is required');
  });
  
  it('Should Not Checkout Without First Name', () => {
    //Start the checkout process without providing a first name and validate the system's response.
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('error').should('contain', 'Error: First Name is required');
  });
  
  it('Should Not Checkout Without Last Name', () => {
    //Attempt to check out without providing a last name and ensure the expected system behavior.
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('error').should('contain', 'Error: Last Name is required');
  });

  it('Should Not Checkout Without Zip Code', () => {
    //Start the checkout without entering a zip code and check for the system's expected response.
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('continue').click();
    cy.getDataTest('error').should('contain', 'Error: Postal Code is required');
  });
  
  it('Should Cancel Checkout on Step One', () => {
    //Begin the checkout process and choose to cancel at the first step, verifying a return to the previous state.
    cy.getDataTest('cancel').click();
    cy.url().should('include', '/cart.html');
  });

  it('Should Cancel Checkout on Step Two', () => {
    //Progress to the second step of checkout and choose to cancel, checking for the expected system behavior.
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('cancel').click();
    cy.url().should('include', '/inventory.html');
  });

})