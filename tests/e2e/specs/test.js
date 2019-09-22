// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'verify base currency is loaded': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000);
    browser.expect.element('div[qa-id="base-currency"]').to.be.visible;
  },

  'verify that user can add a currency': browser => {
    browser.expect.element('input[qa-id="add-currency"]').to.be.visible;
    browser.end()
  },
}
