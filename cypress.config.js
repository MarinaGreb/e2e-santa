const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

  const allureWriter = require('@shelex/cypress-allure-plugin/writer');
// import allureWriter from "@shelex/cypress-allure-plugin/writer";

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://staging.lpitko.ru",
    specPattern: "**/*.feature", 
    testIsolation: false,
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });
      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);
      //on('file:preprocessor', webpackPreprocessor);
      allureWriter(on, config);
      return config;
    },
    env: {
      allureReuseAfterSpec: true
  }
  },
});
