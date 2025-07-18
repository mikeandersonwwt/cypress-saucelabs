/// <reference types="cypress" />

describe('Sauce Cart Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
    
    cy.standard_user_login();
  });


  it('Should Remove Item and Decrease Cart Counter', () => {
    //Add an item to the cart, note the initial cart count, remove the item, and confirm the cart counter is decremented.
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
    cy.getDataTest('shopping-cart-badge').click();
    cy.url().should('include', '/cart.html');
    cy.getDataTest('shopping-cart-badge').should('have.text', '2');
    cy.getDataTest('remove-sauce-labs-backpack').click();
    cy.getDataTest('shopping-cart-badge').should('have.text', '1');
  })

  it('Should Remove All Items', () => {
    //Add multiple items to the cart, initiate the removal of all items, and verify that the cart is empty afterward.
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
    cy.getDataTest('add-to-cart-sauce-labs-bolt-t-shirt').click();
    cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
    cy.getDataTest('shopping-cart-badge').should('have.text', '4').click();
    cy.getDataTest('remove-sauce-labs-backpack').click();
    cy.getDataTest('remove-sauce-labs-bike-light').click();
    cy.getDataTest('remove-sauce-labs-bolt-t-shirt').click();
    cy.getDataTest('remove-sauce-labs-fleece-jacket').click();
    cy.getDataTest('shopping-cart-badge').should('not.exist');
  })

  it('Should Continue Shopping', () => {
    //Navigate to the cart, choose to continue shopping, and ensure a return to the inventory page.
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('shopping-cart-badge').click();
    cy.getDataTest('continue-shopping').click();
    cy.url().should('include', '/inventory.html');
  })

  it('Should Checkout', () => {
    //Add an item to the cart, proceed to checkout, and confirm successful navigation to the checkout process.
    cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
    cy.getDataTest('shopping-cart-badge').click();
    cy.getDataTest('checkout').click();
    cy.url().should('include', '/checkout-step-one.html');
  })
})