/// <reference types="cypress" />

describe('Sauce Inventory Page', () => {
  beforeEach( () => {
    //stop the swag labs 401's
    cy.intercept('POST', 'https://events.backtrace.io/**', {
      statusCode: 200,
      body: {},
    }).as('backtrace');

    cy.standard_user_login();
  });

  context('Inventory', () => {
    
    it('Should List by Name (Z to A)', () => {
      cy.getDataTest('product-sort-container').select('Name (Z to A)');
      // Compares name on first 2 items and verifies sort order alphabetically
      cy.getDataTest('inventory-item-name').then(($names) => {
        const firstName = $names.eq(0).text().trim();
        const secondName = $names.eq(1).text().trim();
        expect(firstName.localeCompare(secondName)).to.eq(1); // first < second
      });
    })

    it('Should List by Name (A to Z)', () => {
      cy.getDataTest('product-sort-container').select('Name (A to Z)');
      // Compares name on first 2 items and verifies sort order alphabetically
      cy.getDataTest('inventory-item-name').then(($names) => {
        const firstName = $names.eq(0).text().trim();
        const secondName = $names.eq(1).text().trim();
        expect(firstName.localeCompare(secondName)).to.eq(-1); // first > second
      });
    })

    it('Should List by Price (low to high)', () => {
      cy.getDataTest('product-sort-container').select('Price (low to high)');
      // Compares price of first 2 items and verifies the first is lower
      cy.getDataTest('inventory-item-price').then(($prices) => {
        const firstPrice = parseFloat($prices.eq(0).text().replace('$', ''));
        const secondPrice = parseFloat($prices.eq(1).text().replace('$', ''));
        expect(firstPrice).to.be.lessThan(secondPrice);
      });
    })

    it('Should List by Price (high to low)', () => {
      cy.getDataTest('product-sort-container').select('Price (high to low)');
      // Compares price of first 2 items and verifies the first is higher
      cy.getDataTest('inventory-item-price').then(($prices) => {
        const firstPrice = parseFloat($prices.eq(0).text().replace('$', ''));
        const secondPrice = parseFloat($prices.eq(1).text().replace('$', ''));
        expect(firstPrice).to.be.greaterThan(secondPrice);
      });
    })

    it('Should Add to Cart and Then Remove from Cart', () => {
      cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
      cy.getDataTest('remove-sauce-labs-backpack').should('be.visible');
      cy.getDataTest('remove-sauce-labs-backpack').click();
      cy.getDataTest('add-to-cart-sauce-labs-backpack').should('be.visible');
    });
  });

  context('Inventory Items', () => {
    
    it('Should Add to Cart and Update Cart Counter', () => {
      // Add items to the cart and verify that the cart counter reflects the updated count.
      cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
      cy.getDataTest('shopping-cart-badge').should('have.text', '1');
      cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
      cy.getDataTest('shopping-cart-badge').should('have.text', '2');
    });

    it('Should Remove from Cart and Update Cart Counter', () => {
      // Remove items from the cart and verify that the cart counter reflects the updated count.
      cy.getDataTest('add-to-cart-sauce-labs-backpack').click();
      cy.getDataTest('add-to-cart-sauce-labs-bike-light').click();
      cy.getDataTest('remove-sauce-labs-backpack').click();
      cy.getDataTest('shopping-cart-badge').should('have.text', '1');
      cy.getDataTest('remove-sauce-labs-bike-light').click();
      cy.getDataTest('shopping-cart-badge').should('not.exist');
    });

    it('Should Return to Inventory Page', () => {
      // Navigate to an item's detailed view, use the back button, and confirm returning to the inventory page.
      cy.getDataTest('inventory-item-name').first().click();
      cy.getDataTest('back-to-products').click();
      cy.url().should('include', '/inventory.html');
    });

  });
})