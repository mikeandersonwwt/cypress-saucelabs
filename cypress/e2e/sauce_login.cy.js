/// <reference types="cypress" />

describe('Sauce Login Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
  });

  it('Login successful', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="header-container"]').contains('Swag Labs');
  });

  it('Login with enter key', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce{enter}');
  });

  it('Password required error', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('test');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-button"]').should('be.visible');
    cy.get('[data-test="error"]').contains('Epic sadface: Password is required');
  });

  it('Username required error', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="password"]').type('test');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-button"]').should('be.visible');
    cy.get('[data-test="error"]').contains('Epic sadface: Username is required');
  });

  it('Username & Password invalid', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('test');
    cy.get('[data-test="password"]').type('test');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error-button"]').should('be.visible');
    cy.get('[data-test="error"]').contains('Epic sadface: Username and password do not match any user in this service');
  });

  it('Login Container Content Validation', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('.login_logo').contains('Swag Labs').should('be.visible');
    cy.get('[data-test="username"]').should('have.attr', 'placeholder','Username').should('be.visible');
    cy.get('[data-test="password"]').should('have.attr', 'placeholder','Password').should('be.visible');
    cy.get('[data-test="login-button"]').should('have.attr', 'value','Login').should('be.visible');
  });

  it('Login Credentials Content Validation', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="login-credentials"]').as('loginCreds');
    cy.get('@loginCreds').contains('h4', 'Accepted usernames are:');
    cy.get('@loginCreds').contains('standard_user');
    cy.get('@loginCreds').contains('locked_out_user');
    cy.get('@loginCreds').contains('problem_user');
    cy.get('@loginCreds').contains('performance_glitch_user');
    cy.get('@loginCreds').contains('error_user');
    cy.get('@loginCreds').contains('visual_user');
    cy.get('[data-test="login-password"]').contains('h4', 'Password for all users:')
    cy.get('[data-test="login-password"]').should('include.text', 'secret_sauce');
  });

})