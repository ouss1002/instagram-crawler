const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const rules = require('./utils/rules');
const fs = require('fs');
const getters = require('./utils/getters');
const funcs = require('./utils/funcs');
const organizer = require('./utils/organizer');

screenshotCounter = 1;

debDate = Date.parse(rules.startDate);
endDate = Date.parse(rules.endDate);

rules.links = funcs.normalizeLinks(rules.links);

profiles = {

};

(async () => {
    const browser = await puppeteer.launch({
        executablePath: rules.pathToChrome,
        headless: rules.hideScreen,
        ignoreHTTPSErrors: true,
        userDataDir: './tmp',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ],
    });

    const page = await browser.newPage();

    const preloadFile = fs.readFileSync('./preload.js', 'utf8');
    await page.evaluateOnNewDocument(preloadFile);

    if(rules.emulate) {
        await page.emulate(devices.devicesMap[rules.device]);
    }
    
	page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });

    // await page.goto(rules.loginPage);
    // await page.waitFor('input[name="username"]');
    // await page.waitFor('input[name="password"]');
    
    // await page.type('input[name="username"]', rules.username);
    // await page.type('input[name="password"]', rules.password);

    // await page.click('button[type="submit"]');

    // await page.waitForNavigation();

    await page.goto('https://www.instagram.com/');

    try {
        // await console.log('1: 0');
        // await page.waitFor(10000);
        // await console.log('1: 10');
        // await screenThis(page);
        await page.evaluate(() => {
            let ele = document.querySelector('.aOOlW.HoLwm');
            if(ele != null) {
                ele.click();
            }
        });

        try{
            // await console.log('2: 0');
            // await page.waitFor(10000);
            // await console.log('2: 10');
            // await screenThis(page);
            await page.evaluate(() => {
                let ele = document.querySelector('.aOOlW.HoLwm');
                if(ele != null) {
                    ele.click();
                }
            });
        }
        catch(err){
            console.log(err);
        }
    }
    catch(err) {
        console.log(err);
    }

    result = await getters.crawlProfilesFromList(page, rules);
    console.log(result);

    // organizer.writeJSON(result, './output.json');
    // console.log('JSON full file has been saved.');

})();

screenThis =  async (page) => {
    await page.screenshot({
        path: `screens/screen${screenshotCounter}.jpg`,
    });

    await screenshotCounter++;
};
