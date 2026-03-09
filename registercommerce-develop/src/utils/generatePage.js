const puppeteer = require('puppeteer');

const chromiumURL = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

let browser = null;

async function loadWebPage() {
  browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromiumURL,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    waitUntil: 'networkidle2',
    timeout: 0
  });
}

const generatePage = async (file) => {
  try {
    if (!browser) {
      await loadWebPage();
    }
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setContent(file);
    const pdf = await page.pdf({
      format: 'letter',
      printBackground: true,
      displayHeaderFooter: false,
      timeout: 0,
      margin: {
        top: '1.5cm', right: '1.5cm', left: '1.5cm', bottom: '1.5cm'
      }
    });
    page.close();
    return pdf;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err, 'Error generatePage');
    return null;
  }
};

module.exports = generatePage;
