/// <reference types="cypress" />

describe('Sauce Random Stuff', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');
  });

  // Basic commands
  it('Basic commands', () => {
    cy.visit('');
    cy.getDataTest("username").type('standard_user'); // Type into an input field
    cy.getDataTest("password").type('secret_sauce');
    cy.getDataTest("username").clear(); //clear the input field
    cy.getDataTest("username").type('standard_user');
    cy.getDataTest("login-button").click(); // Click a button
    cy.getDataTest("header-container").contains('Swag Labs'); // contains the text

    cy.location('pathname').should('eq', '/inventory.html'); // check the url - use when you want to work with parts of the URL
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html') // check the url - use when you want to work with the full URL
    cy.title().should('eq', 'Swag Labs') // check the page title
    cy.reload(); // reload the page
    cy.getCookie('session-username').its('value').should('not.be.empty'); // check a cookie
    cy.wait(1000); // wait for 1 second

    // NAVIGATION COMMANDS
    cy.getDataTest('footer').scrollTo('bottom', { ensureScrollable: false }); // scroll to an element. Using "{ ensureScrollable: false }" because element is not scrollable
    cy.getDataTest("header-container").scrollTo('top', { ensureScrollable: false });
    cy.getDataTest('footer').scrollIntoView();
    cy.go('back'); // go back a page
    cy.go('forward'); // go forward a page
    cy.getDataTest('add-to-cart-sauce-labs-backpack').trigger('mouseover'); // hover over an element

    // ASSERTIONS
    cy.getDataTest('inventory-item-sauce-labs-backpack-img').should('be.visible'); // check if an element is visible
    cy.getDataTest('add-to-cart-sauce-labs-backpack').should('be.enabled'); // check if an element is enabled
    cy.getDataTest('add-to-cart-sauce-labs-backpack').should('not.be.disabled'); // check if an element is disabled
  })

  // alias is used to replace the full data-test command
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

  it('Variables', () => {
    cy.visit('');
    const loginCreds = '[data-test="login-credentials"]';
    cy.get(loginCreds).contains('h4', 'Accepted usernames are:');
    cy.get(loginCreds).contains('standard_user');
    cy.get(loginCreds).contains('locked_out_user');
    cy.get(loginCreds).contains('problem_user');
    cy.get(loginCreds).contains('performance_glitch_user');
    cy.get(loginCreds).contains('error_user');
    cy.get(loginCreds).contains('visual_user');

  });

  // chaining commands together
  it('Chaining', () => {
    cy.visit('');
    cy.get('[data-test="login-credentials"]').contains('h4', 'Accepted usernames are:') // can't chain with others because of h4
    cy.get('[data-test="login-credentials"]').contains('standard_user')
      .contains('locked_out_user')
      .contains('problem_user')
      .contains('performance_glitch_user')
      .contains('error_user')
      .contains('visual_user')
  });

  // use fixtures to supply mock data to your tests. See "fixtures" folder.
  // this uses the "users.json" file and loops through each
  it('Fixtures', () => {
    cy.fixture('users').its('data').then(users => {
      users.forEach(({ username, password }) => {
        cy.visit('');
        cy.getDataTest('username').type(username)
        cy.getDataTest('password').type(password)
        cy.getDataTest('login-button').click()
      })
    })
  })

  // use support commands to add custom commands
  // standard_user_login is a custom command wrapping the standard user login
  it('Support Command - add', () => {
    cy.standard_user_login();
    cy.getDataTest("header-container").contains('Swag Labs');
  }) 

  // getDataTest is a custom command to avoid the full data-test command
  it('Support Command - addQuery', () => {
    cy.visit('');
    cy.getDataTest('username').type('test');
    cy.getDataTest('password').type('test');
    cy.getDataTest('login-button').click();
    cy.getDataTest('error-button').should('be.visible');
    cy.getDataTest('error').contains('Epic sadface: Username and password do not match any user in this service');
  }); 

  // saves to cypress/screenshots folder
  it('Screenshot', () => {
    cy.standard_user_login();
    //cy.screenshot();
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
    //cy.intercept('GET', '/api/users', { fixture: 'users.json' })
  })

  // Make a request
  it('Request + API example', () => {
    cy.request('https://www.saucedemo.com').its('status').should('eq', 200)
    
    // cy.request({
    //   method: 'POST',
    //   url: 'https://example.com/api/login',
    //   body: {
    //     email: 'testuser@example.com',
    //     password: 'testpassword',
    //   },
    // }).should((response) => {
    //   expect(response.status).to.eq(200)
    //   expect(response.body).to.have.property('token')
    // })
  })

  it('Files - Read and Write', () => {
    cy.writeFile('cypress/fixtures/output.txt', '') // clear it first
    cy.writeFile('cypress/fixtures/output.txt', 'Hello, World!')
    cy.readFile('cypress/fixtures/output.txt').should('eq', 'Hello, World!')
  })

   it('Use enter key', () => {
    cy.visit('/');
    cy.getDataTest('username').type('standard_user');
    cy.getDataTest('password').type('secret_sauce{enter}');
    cy.url().should('include', '/inventory.html')
  });

})