// Examples of the commands listed here: https://docs.cypress.io/api/table-of-contents
import 'cypress-plugin-tab'
import 'cypress-localstorage-commands'; 
/// <reference types="cypress" />

describe('Commands', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
        statusCode: 200,
        body: {},
    }).as('backtrace');

    cy.visit('https://www.saucedemo.com/');
    cy.getDataTest('username').type('standard_user');
    cy.getDataTest('password').type('secret_sauce');
    cy.getDataTest('login-button').click();
  });

//*********************
//      QUERIES
//*********************
//https://docs.cypress.io/api/table-of-contents#Queries

  context('Queries', () => {
    
    it('.as()', () => {
      cy.getDataTest("header-container").as('header');
      cy.get('@header').contains('Swag Labs');
    })

    it('.children()', () => {
      cy.getDataTest('inventory-list')
      .children('.inventory_item')
      .should('have.length', 6)
    })

    it('.closest()', () => {
      // Find the price element, get closest inventory_item, then check it contains the expected product name
      cy.get('.inventory_item_price')
        .first()
        .closest('.inventory_item')
        .contains('.inventory_item_name', 'Sauce Labs Backpack')
    })

    it('.contains()', () => {
      cy.getDataTest('header-container').contains('Swag Labs');
    })

    it('.document()', () => {
      cy.document().should('have.property', 'charset', 'UTF-8');
    })

    it('.eq()', () => {
      cy.getDataTest('inventory-item').eq(2).contains('Sauce Labs Bolt T-Shirt');
    })

    it('.filter()', () => {
      cy.get('.inventory_item')
      .find('button')
      .filter(':contains("Add to cart")')
      .should('have.length', 6) // all 6 items should have one    
    })

    it('.find()', () => {
      cy.getDataTest('inventory-list').find('.inventory_item').should('have.length', 6);
    })

    it('.first()', () => {
      cy.getDataTest('inventory-item')
      .first()
      .find('button')
      .contains('Add to cart')
    })

    it('.focused()', () => {
      // needs the cypress-plugin-tab for tab
      cy.visit('https://www.saucedemo.com')
      cy.get('body').tab() // if using the cypress-plugin-tab
      cy.focused().should('have.attr', 'data-test', 'username')
      cy.tab() 
      cy.focused().should('have.attr', 'data-test', 'password')
    })

    it('.get()', () => {
      cy.get('[data-test="inventory-item"]').eq(2).contains('Sauce Labs Bolt T-Shirt');
    })

    it('.hash()', () => {
      cy.visit('https://www.saucedemo.com/inventory.html#inventory')
      cy.hash().should('eq', '#inventory');
    })

    it('.invoke()', () => {
      cy.getDataTest('inventory-item').eq(2)
      .invoke('text')
      .should('include', 'Sauce Labs Bolt T-Shirt');
    })

    it('.its()', () => {
      cy.getDataTest('inventory-item')
      .its('length')
      .should('eq', 6)
    })

    it('.last()', () => {
      cy.getDataTest('inventory-item')
      .last()
      .find('button')
      .contains('Add to cart')
    })

    it('.location()', () => {
      cy.location('pathname').should('eq', '/inventory.html');
    })

    it('.next()', () => {
      // get the 1st item, find it's name element, use next to get the description that follows
      cy.getDataTest('inventory-item')
      .first()
      .find('.inventory_item_name')
      .next('.inventory_item_desc')
      .should('not.be.empty')
    })

    it('.nextAll()', () => {
      // gets all following siblings
      cy.getDataTest('inventory-item')
        .first()
        .nextAll()
        .should('have.length', 5)
        .should('have.class', 'inventory_item')
    })

    it('.nextUntil()', () => {
      // finds twitter the goes nextUntil LinkedIn leaving Facebook as the only one in between
      cy.get('.social_twitter')
      .nextUntil('.social_linkedin')
      .should('have.length', 1) // should only get Facebook between Twitter and LinkedIn
      .should('have.class', 'social_facebook')
    })

    it('.not()', () => {
      cy.contains('Add to cart').first().click()
      // Get all buttons and filter out the ones that say "Remove"
      cy.get('.inventory_item button')
        .not(':contains("Remove")')
        .should('contain', 'Add to cart')    
        .should('have.length', 5)
    })

    it('.parent()', () => {
      // Get the immediate parent of the price
      cy.get('.inventory_item_price')
        .first()
        .parent()
        .should('have.class', 'pricebar')
    })

    it('.parents()', () => {
      // Get all ancestor elements with inventory_item class
      cy.get('.inventory_item_price')
        .first()
        .parents('.inventory_item')
        .should('have.length', 1)
    })

    it('.parentsUntil()', () => {
      // Get all ancestors between price and inventory list
      cy.get('.inventory_item_price')
        .first()
        .parentsUntil('.inventory_list')
        .should('have.length', 3) // pricebar and inventory_item
    })

    it('.prev()', () => {
      // Start from Add to Cart button and go to the price
      cy.contains('Add to cart')
        .first()
        .prev()
        .should('have.class', 'inventory_item_price')
    })

    it('.prevAll()', () => {
      // Start from Add to Cart button and get all previous siblings
      cy.contains('Add to cart')
        .first()
        .prevAll()
        .should('have.length', 1) // just the price
        .first()
        .should('have.class', 'inventory_item_price')    })

    it('.prevUntil()', () => {
      // Start from Add to Cart button and get elements until we find the name
      cy.contains('Add to cart')
        .first()
        .prevUntil('.inventory_item_name')
        .should('have.length', 1) // should get the price element
        .first()
        .should('have.class', 'inventory_item_price')
    })

    it('.root()', () => {
      // root() gets the root element of the current command chain
      cy.get('.inventory_item').first().within(() => {
        // Inside within(), root() is scoped to the inventory item
        cy.root().should('have.class', 'inventory_item')
        cy.root().find('.inventory_item_name').should('exist')
      })
      // Outside within(), root() is the default document
      cy.root().should('match', 'html')
    })

    it('.shadow()', () => {
      // Note: saucedemo doesn't use shadow so here's a example from Cypress
      // see https://docs.cypress.io/api/commands/shadow
      
      // example DOM text
      // <div class="shadow-host">
      //   #shadow-root
      //   <button class="my-button">Click me</button>
      // </div>
    
      // yields [#shadow-root (open)]
      //cy.get('.shadow-host').shadow().find('.my-button').click()
      cy.task('logToTerminal', "saucedemo doesn't have shadow");
    })

    it('.siblings()', () => {
      cy.getDataTest('inventory-item')
      .first()
      .find('.inventory_item_label')   // container with product name
      .siblings('.pricebar')           // sibling container with price & button
      .find('.inventory_item_price')   // find the price inside
      .should('have.text', '$29.99')
    })

    it('.title()', () => {
      cy.title().should('eq', 'Swag Labs')
    })

    it('.url()', () => {
      cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
    })

    it('.window()', () => {
      cy.window().should('have.property', 'document')
    })
  })

//*********************
//     ASSERTIONS
//*********************
//https://docs.cypress.io/api/table-of-contents#Assertions

  context('Assertions', () => {
    
    it('.and()', () => {
      cy.getDataTest('add-to-cart-sauce-labs-backpack')
        .should('exist')
        .and('be.visible')
        .and('have.text', 'Add to cart')
        .click()
    })

    it('.should()', () => {
      cy.getDataTest('add-to-cart-sauce-labs-backpack')
        .should('exist')
        .should('be.visible')
        .should('have.text', 'Add to cart')
        .click()
    })
  })

//*********************
//      ACTIONS
//*********************
//https://docs.cypress.io/api/table-of-contents#Actions

  context('Actions', () => {
    
    it('.check()', () => {
      //saucedemo doesn't have checkboxes or radio buttons so here's an example.
      //see https://docs.cypress.io/api/commands/check
      //cy.get('value').check().should('be.checked');
      cy.task('logToTerminal', "saucedemo doesn't have checkboxes or radio buttons");
    })


    it('.clear()', () => {
      cy.go('back');
      cy.getDataTest('username').type('standard_user');
      cy.getDataTest('password').type('secret_sauce');
      cy.getDataTest('username').clear().should('be.empty');
      cy.getDataTest('password').clear().should('be.empty');
    })

    it('.click()', () => {
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').should('not.exist');
    })

    it('.dblclick()', () => {
      // Double click the remove button and verify it still is at remove
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').click();
      cy.getDataTest('remove-sauce-labs-fleece-jacket').dblclick();
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').should('not.exist');
    })

    it('.rightclick()', () => {
      // Right click on product image and verify it's still visible after
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').rightclick();
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket').should('be.visible');
    })

    it('.scrollIntoView()', () => {
      cy.getDataTest('footer').scrollIntoView();
    })

    it('.scrollTo()', () => {
      cy.getDataTest('footer').scrollTo('bottom', { ensureScrollable: false }); // scroll to an element. Using "{ ensureScrollable: false }" because element is not scrollable
      cy.getDataTest('header-container').scrollTo('top', { ensureScrollable: false });
    })

    it('.select()', () => {
      // filter page results
      cy.getDataTest('product-sort-container').as('filter')
      cy.get('@filter').select('Name (Z to A)')
      cy.get('@filter').should('have.value', 'za')
      cy.get('@filter').select('Price (low to high)')
      cy.get('@filter').should('have.value', 'lohi')
      cy.get('@filter').select('Name (A to Z)')
      cy.get('@filter').should('have.value', 'az')
    })

    it('.selectFile()', () => {
      //saucedemo doesn't have any file inputs so here's an example
      //see https://docs.cypress.io/api/commands/selectfile
      //cy.get('#file-input').selectFile(['cypress/fixtures/file1.txt'])
      cy.task('logToTerminal', "saucedemo doesn't have file inputs");
    })

    it('.trigger()', () => {
      cy.getDataTest('add-to-cart-sauce-labs-fleece-jacket')
        .trigger('mouseover').click();
      cy.getDataTest('remove-sauce-labs-fleece-jacket').should('be.visible');
    })

    it('.type()', () => {
      cy.go('back');
      cy.getDataTest('username').type('standard_user');
      cy.getDataTest('password').type('secret_sauce');
    })

    it('.uncheck()', () => {
      //saucedemo doesn't have checkboxes or radio buttons so here's an example.
      //see https://docs.cypress.io/api/commands/uncheck
      //cy.get('value').uncheck().should('be.unchecked');
      cy.task('logToTerminal', "saucedemo doesn't have checkboxes or radio buttons");
    })
  })

//*********************
//      OTHER
//*********************
// https://docs.cypress.io/api/table-of-contents#Other-Commands

  context('Other Commands', () => {
    
    it('.blur()', () => {
      cy.go('back')
      cy.getDataTest('username')
        .type('standard_user')
        .should('be.focused')
      cy.getDataTest('username')
        .blur()
        .should('not.be.focused')
    })

    it('.clearAllCookies()', () => {
      cy.getCookies().should('have.length.gt', 0)
      cy.clearAllCookies();
      cy.getCookies().should('have.length', 0)
    })

    it('.clearAllLocalStorage()', () => {
      // Add item to cart to create localStorage data
      cy.getDataTest('add-to-cart-sauce-labs-backpack').click()
      cy.clearAllLocalStorage()
      cy.reload()
      cy.getDataTest('shopping-cart-badge').should('not.exist')
    })

    it('.clearAllSessionStorage()', () => {
      // Set a session storage item to clear and verify it's there
      cy.window().then((win) => {
        win.sessionStorage.setItem('test', '1234');
        expect(win.sessionStorage.getItem('test')).to.equal('1234');
      });
      // Clear and confirm it's removed
      cy.clearAllSessionStorage();
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('test')).to.be.null;
      });
    })

    it('.clearCookie()', () => {
      cy.clearCookie('session-username')
      cy.reload()
      cy.getDataTest('login-button').should('be.visible')
    })

    it('.clearCookies()', () => {
      cy.getCookies().should('have.length.gt', 0)
      cy.clearCookies();
      cy.getCookies().should('have.length', 0)
    })

    it('.clearLocalStorage()', () => {
      // Add item to cart to create localStorage data
      cy.getDataTest('add-to-cart-sauce-labs-backpack').click()
      cy.clearLocalStorage()
      cy.reload()
      cy.getDataTest('shopping-cart-badge').should('not.exist')
    })

    it('.clock()', () => {
      // Set clock to fixed time
      const fixedDate = new Date(2025, 0, 1).getTime() // January 1, 2025
      cy.clock(fixedDate)
    })

    it('.debug()', () => {
      // pauses test execution
      //see https://docs.cypress.io/api/commands/debug
      //cy.debug()
      // cy.getDataTest('inventory-container')
      //   .debug()
      //   .find('.inventory_item')
      //   .should('have.length', 6)
      cy.task('logToTerminal', '.debug() pauses test execution until you manually restart it');
    })

    it('.each()', () => {
      // Verify each product has a price with $ symbol
      cy.getDataTest('inventory-item-price').each(($price) => {
        expect($price.text()).to.include('$');
      });
    })

    it('.end()', () => {
      // Start with Add to Cart button
      cy.getDataTest('add-to-cart-sauce-labs-backpack')
        .click()
        .should('not.exist')
      // End the chain and start a new one
      .end()
      // Verify cart badge
      .getDataTest('shopping-cart-badge')
        .should('contain', '1')
    })

    it('.exec()', () => {
      // Execute a function
      cy.exec('echo "Hello World"').then((result) => {
        expect(result.stdout).to.equal('Hello World')
      })
    })

    it('.fixture()', () => {
      cy.go('back')
      cy.fixture('examples').then(({ username, password }) => {
        cy.getDataTest('username').type(username)
        cy.getDataTest('password').type(password)
        cy.getDataTest('login-button').click();
        cy.getDataTest("header-container").contains('Swag Labs');
      })
    })

    it('.focus()', () => {
      cy.go('back')
      cy.getDataTest('username')
        .focus()
        .should('be.focused')
    })

    it('.getAllCookies()', () => {
      cy.getAllCookies().should('have.length.gt', 0)
    })

    it('.getAllLocalStorage()', () => {
      // set a local storage value to verify
      cy.window().then((win) => {
        win.localStorage.setItem('test', '1234');
        expect(win.localStorage.getItem('test')).to.equal('1234');
      })
      cy.getAllLocalStorage().then((storage) => {
        expect(storage['https://www.saucedemo.com']).to.have.property('test', '1234')
      })
    })

    it('.getAllSessionStorage()', () => {
      // set a session storage value to verify
      cy.window().then((win) => {
        win.sessionStorage.setItem('test', '1234');
        expect(win.sessionStorage.getItem('test')).to.equal('1234');
      })
      cy.getAllSessionStorage().then((storage) => {
        expect(storage['https://www.saucedemo.com']).to.have.property('test', '1234')
      })
    })

    it('.getCookie()', () => {
      cy.getCookie('session-username').should('exist')
    })

    it('.getCookies()', () => {
      cy.getCookies().should('have.length.gt', 0)
    })

    it('.go()', () => {
      cy.go('back') //navigate back a page
      cy.go('forward') //navigate forward a page
    })

    it('.hover()', () => {
      cy.task('logToTerminal', 'cy.hover() is not available, see https://docs.cypress.io/api/commands/hover');
    })

    it('.intercept()', () => {
      cy.intercept('POST', 'https://events.backtrace.io/**', {
        statusCode: 200,
        body: {},
      }).as('backtrace');
    })

    it('.log()', () => {
      cy.log('Test message')
    })

    it('.mount()', () => {
      cy.task('logToTerminal', 'cy.mount() is used for component testing and this is e2e. see https://docs.cypress.io/api/commands/mount');
    })

    it('.origin()', () => {
      // Visit different origin
      cy.origin('https://the-internet.herokuapp.com/', () => {
        cy.visit('/checkboxes')
        cy.url().should('include', 'the-internet.herokuapp.com') //verify
      })
      // Back to original site
      cy.visit('https://www.saucedemo.com')
      cy.url().should('include', 'saucedemo.com')
    })

    it('.pause()', () => {
      // pauses the session until you manually hit the resume button in the browser
      //cy.pause()
      cy.task('logToTerminal', '.pause() pauses the session until you manually hit the resume button in the browser');
    })

    it('.press()', () => {
      // it's better to use {} for native key events
      //cy.press(Cypress.Keyboard.Keys.TAB) is the only compatible key
      cy.task('logToTerminal', '.press() is not available, see https://docs.cypress.io/api/commands/press');
    })

    it('.readFile()', () => {
      cy.writeFile('cypress/fixtures/output.txt', '') // clear it first
      cy.writeFile('cypress/fixtures/output.txt', 'Hello, World!')
      cy.readFile('cypress/fixtures/output.txt').should('eq', 'Hello, World!')
    })
  
    it('.reload()', () => {
      cy.reload()
    })

    it('.request() + API example', () => {
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

    it('.screenshot()', () => {
      // takes a screenshot and saves to cypress/screenshots folder
      //cy.screenshot();
    })

    it('.session()', () => {
      // Session already being created with the beforeEach but here's an example
      // cy.session('standard_user', () => {
      //   cy.visit('https://www.saucedemo.com')
      //   cy.getDataTest('username').type('standard_user')
      //   cy.getDataTest('password').type('secret_sauce')
      //   cy.getDataTest('login-button').click()
      // })
      
      // // Visit page after session is created
      // cy.visit('https://www.saucedemo.com')
    })

    it('.setCookie()', () => {
      cy.setCookie('test-cookie', 'test-value')
      cy.getCookie('test-cookie')
        .should('have.property', 'value', 'test-value')
    })

    it('.spread()', () => {
      // Get product details from page
      cy.getDataTest('inventory-item').first()
        .find('.inventory_item_name, .inventory_item_price')
        .then(($els) => {
          // Use spread to work with both elements at once
          cy.wrap([$els.eq(0).text(), $els.eq(1).text()])
            .spread((name, price) => {
              // Log and verify the product details
              cy.log(`Found product: ${name} at ${price}`)
              expect(name).to.equal('Sauce Labs Backpack')
              expect(price).to.equal('$29.99')
            })
        })
    })

    it('.spy()', () => {
      // Create an object with a method we can spy on
      const cart = {
        addItem: (name) => `Added ${name} to cart`
      }
      // Create spy on the addItem method and call the method
      cy.spy(cart, 'addItem').as('addItemSpy')
      cart.addItem('Sauce Labs Backpack')
      // Verify the spy
      cy.get('@addItemSpy')
        .should('have.been.called')
        .and('have.been.calledWith', 'Sauce Labs Backpack')
    })

    it('.stub()', () => {
      // Generic example - Stub Math.random to always return 1
      cy.stub(Math, 'random').returns(1).as('randomStub')
      // Use Math.random and verify stub worked
      const result = Math.random()
      cy.get('@randomStub')
        .should('have.been.called')
        .and('have.returned', 1)
    })

    it('.submit()', () => {
      cy.go('back');
      cy.getDataTest('username').type('standard_user');
      cy.getDataTest('password').type('secret_sauce');
      cy.get('.login-box form').submit();
      cy.url().should('include', '/inventory.html')
    })

    it('.task()', () => {
      // This command requires configuration in cypress.config.js
      // logs a command in the browser, not the console
      cy.task('logToTerminal', 'This is a test message from Cypress');
    })

    it('.then()', () => {
      cy.go('back')
      cy.fixture('examples').then(({ username, password }) => {
        cy.getDataTest('username').type(username)
        cy.getDataTest('password').type(password)
        cy.getDataTest('login-button').click();
      })
    })  
    
    it('.tick()', () => {
      cy.clock() // must call clock before tick
      cy.tick(2000) // advance the clock by the specified number of milliseconds
    })

    it('.viewport()', () => {
      // For a list of devices see https://docs.cypress.io/api/commands/viewport
      cy.viewport('iphone-x')
      cy.getDataTest('inventory-item-sauce-labs-backpack-img').should('be.visible')
      // Desktop view
      cy.viewport(1280, 720)
      cy.getDataTest('inventory-item-sauce-labs-backpack-img').should('be.visible')
    })

    it('.visit()', () => {
      cy.visit('https://www.saucedemo.com')
    })

    it('.wait()', () => {
      cy.wait(500)
    })

    it('.within()', () => {
      // Work with elements inside first inventory item
      cy.getDataTest('inventory-item').first()
        .within(() => {
          // These selectors only work within the first item
          cy.getDataTest('inventory-item-name').should('contain', 'Sauce Labs Backpack')
          cy.getDataTest('inventory-item-price').should('contain', '$29.99')
          cy.getDataTest('add-to-cart-sauce-labs-backpack').click()
        })
    })

    it('.wrap()', () => {
      cy.go('back')
      // Wrap a simple object and verify its properties
      const user = {
        username: 'standard_user',
        password: 'secret_sauce'
      }
      cy.wrap(user).then((credentials) => {
        cy.getDataTest('username').type(credentials.username)
        cy.getDataTest('password').type(credentials.password)
        cy.getDataTest('login-button').click()
      })
    })

    it('.writeFile()', () => {
      cy.writeFile('cypress/fixtures/output.txt', '') // clear it first
      cy.writeFile('cypress/fixtures/output.txt', 'Hello, World!')
      cy.readFile('cypress/fixtures/output.txt').should('eq', 'Hello, World!')
    })
  })
})