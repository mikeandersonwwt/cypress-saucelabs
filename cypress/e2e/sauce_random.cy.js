/// <reference types="cypress" />

describe('Sauce Random Stuff', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
  });


  it('Alias', () => {
    cy.visit('');
    cy.get('[data-test="login-credentials"]').as('loginCreds');
    cy.get('@loginCreds').contains('h4', 'Accepted usernames are:');
    cy.get('@loginCreds').contains('standard_user');
    cy.get('@loginCreds').contains('locked_out_user');
    cy.get('@loginCreds').contains('problem_user');
    cy.get('@loginCreds').contains('performance_glitch_user');
    cy.get('@loginCreds').contains('error_user');
    cy.get('@loginCreds').contains('visual_user');
  });

  it('Support Command add', () => {
    cy.standard_user_login();
    cy.get('[data-test="header-container"]').contains('Swag Labs');
  })

  it('Support Command addQuery', () => {
    cy.visit('');
    cy.getDataTest('username').type('test');
    cy.getDataTest('password').type('test');
    cy.getDataTest('login-button').click();
    cy.getDataTest('error-button').should('be.visible');
    cy.getDataTest('error').contains('Epic sadface: Username and password do not match any user in this service');
  });

  it('Screenshot', () => {
    cy.standard_user_login();
    //cy.screenshot();
    // saves to cypress/screenshots folder
  })
  
  it('Clock', () => {
    cy.visit('');
    cy.clock(); // signify you want to manipulate the clock
    cy.tick(2000); // advance the clock by the specified number of milliseconds
  })

  //cy.intercept(); // intercepts HTTP requests
  it('Intercept', () => {
    cy.visit('');
    cy.intercept('POST', 'https://events.backtrace.io/**', {statusCode: 200});
  })

  // it('Make API request', () => {
  //   cy.request({
  //     method: 'POST',
  //     url: 'https://saucedemo.com',
  //     body: {
  //       username: 'standard_user',
  //       password: 'secret_sauce'
  //     }
  //   }); 
  // })

  it.only('get cookie', () => {
    cy.standard_user_login();
    cy.location('pathname').should('eq', '/inventory.html');
    cy.getCookie('session-username').its('value').should('not.be.empty');
  });


})