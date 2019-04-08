const puppeteer = require('puppeteer');
const CREDS = require('./creds');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://app.periscopedata.com/app/l2/299326/Brand-Matching:-Ulta-Category-Page?widget=3926023&udv=657634');

  const USERNAME_SELECTOR = '#email'
  const PASSWORD_SELECTOR = '#password'
  const LOGIN_BUTTON_SELECTOR = 'div.login-actions > div.submit-button'
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await page.click(LOGIN_BUTTON_SELECTOR);

  await page.waitForNavigation();

  const PRODUCT_TOURS_MODAL_BUTTON = '#walkme-balloon-2149795 > div > div.walkme-custom-balloon-inner-div > div.walkme-custom-balloon-bottom-div > div.walkme-custom-balloon-top-div-bottom > div > button';
  await page.waitFor(PRODUCT_TOURS_MODAL_BUTTON);
  await page.click(PRODUCT_TOURS_MODAL_BUTTON);

  await page.click('div.expand.button'); // open the chart options menu 
  await page.click('div.menu-item.edit-copy'); // open the query edit tab
  
  // Click on the query link to load the actual SQL
  const queryNode = await page.$x("//div[contains(text(), 'Query')]");
  await queryNode[0].click();

  // Get the SQL
  const text = await page.$$eval('div.CodeMirror-code', e => e[1].innerText);
  rawText = text.split('\n')
  resultSQL = rawText.reduce((acc, val) => {
    if (isNaN(parseInt(val))) {
      console.log(acc)
      return acc + val + '\n'
    }
    return acc
  }, '')
  console.log(resultSQL)

})();