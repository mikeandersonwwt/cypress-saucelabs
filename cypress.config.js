const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // for the .task() command
      on('task', {
        logToTerminal(message) {
          console.log('TEST NOTE:', message);
          return null;
        },
      });

    },
  },
});
