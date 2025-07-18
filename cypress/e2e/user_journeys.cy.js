/// <reference types="cypress" />

describe('E2E User Journeys', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
        statusCode: 200,
        body: {},
        log: false
    }).as('eventsBacktrace');

    cy.intercept('POST', 'https://submit.backtrace.io/**', {
      statusCode: 503,
      body: {},
      log: false
    }).as('submitBacktrace');

  });


  it('standard_user - purchases all 6 items', () => {
    cy.loginSauce('standard_user', 'secret_sauce');
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
    cy.loginSauce('locked_out_user', 'secret_sauce');
    cy.getDataTest('error').should('contain', 'Epic sadface: Sorry, this user has been locked out.');
    cy.get('.svg-inline--fa.fa-times-circle').should('have.length', 2);
  })


  it('problem_user - only 3 items added to cart and checkout errors', () => {
    cy.loginSauce('problem_user', 'secret_sauce');
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
    cy.getDataTest('add-to-cart-sauce-labs-bolt-t-shirt').click();
    cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
    cy.getDataTest('add-to-cart-sauce-labs-onesie').click();
    cy.getDataTest('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    cy.getDataTest('shopping-cart-link').click();
    cy.getDataTest('inventory-item').should('have.length', 3);
    cy.getDataTest('checkout').click();
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('error').should('contain', 'Error: Last Name is required');
    cy.url().should('include', '/checkout-step-one.html');
  })

  it('performance_glitch_user - purchase all 6 items and no issue with glitch', () => {
    cy.loginSauce('performance_glitch_user', 'secret_sauce');
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

  it('error_user - only 3 items added and not able to finish checkout. Has uncaught exceptions', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      expect(
        err.message.includes('Failed to add item to the cart') ||
        err.message.includes('Cannot read properties of undefined')
      )
      // Return false to prevent Cypress from failing the test
      return false;
    })
    cy.loginSauce('error_user', 'secret_sauce');
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
    cy.getDataTest('add-to-cart-sauce-labs-bolt-t-shirt').click();
    cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
    cy.getDataTest('add-to-cart-sauce-labs-onesie').click();
    cy.getDataTest('add-to-cart-test.allthethings()-t-shirt-(red)').click();
    cy.getDataTest('shopping-cart-link').click();
    cy.getDataTest('inventory-item').should('have.length', 3);
    cy.getDataTest('checkout').click();
    cy.getDataTest('firstName').type('Test');
    cy.getDataTest('lastName').type('User');
    cy.getDataTest('postalCode').type('12345');
    cy.getDataTest('continue').click();
    cy.getDataTest('total-label').should('contain', '$51.81');
    cy.getDataTest('finish').click();
    cy.url().should('include', '/checkout-step-two.html');
    cy.getDataTest('complete-header').should('not.exist');
  })

  it('visual_user -', () => {
    cy.loginSauce('visual_user', 'secret_sauce');
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

})