const c = require('ansi-colors');
const playwright = require('playwright');
const {extract} = require('../routes/fetch');
const routes = require('../routes');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//https://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger/55865689#55865689
//https://peter.sh/experiments/chromium-command-line-switches/#enable-automation
//https://chromedriver.chromium.org/capabilities
const args = [
  '--disable-features=IsolateOrigins,site-per-process',
  '--disable-site-isolation-trials=1',
  '--disable-session-crashed-bubble',
  '--ignore-certificate-errors',
  '--disable-site-isolation=1',
  '--disable-web-security=1',
  '--disable-notifications',
  '--disable-infobars',
  '--force-dark-mode',
  '--test-type',
];
const pages = {};
const browsers = {};
const bcontexts = {};
module.exports = () => {
  (async () => {
    const {
      argv,
      fn: {home}
    } = global.mitm;
    for (let browserName in argv.browser) {
      const options = {headless: false};
      let page, browser, bcontext;
      
      if (browserName==='chromium') {
        options.excludeSwitches = ['enable-automation'];
        let path = `${process.cwd()}/`;
        if (argv.plugins) {
          path += argv.plugins.replace(/,/g, path);
          path += `,${global.__app}/extension/chrome`;
          console.log('PATH EXT', path);
        } else {
          path = `${global.__app}/extension/chrome`;
        }
        args.push(`--disable-extensions-except=${path}`);
        args.push( `--load-extension=${path}`);
        if (argv.proxypac) {
          args.push(`--proxy-pac-url=${argv.proxypac}`);
        }
        options.args = args;
      }
      let execPath = argv.browser[browserName];
      if (typeof(execPath)==='string') {
        options.executablePath = home(execPath);
        if (browserName!=='chromium') {
          console.log(c.redBright('executablePath is unsupported for non Chrome!'))
        }
      } else {
        const _browser = require('playwright')[browserName];
        execPath = _browser.executablePath();
      }
      console.log(c.yellow(`>> executablePath ${execPath}\n`));
      const playBrowser = playwright[browserName];
      if (argv.pristine) {
        // buggy route will not work :(
        const bprofile = `${global.mitm.home}/.${browserName}`;
        console.log('>> Browser profile', bprofile);
        browser = await playBrowser.launchPersistentContext(bprofile, options);
        page = await  browser.pages()[0];
        bcontext = browser;
      } else {
        browser = await playBrowser.launch(options);
        const context = await browser.newContext({viewport: { height: 734, width: 800 }});
        page = await context.newPage();  
        bcontext = context;
      }
      if (argv.logurl) {
        bcontext.route('**/*', (route) => {
          const {url, method, headers} = extract({route, browserName});
          if (url.match('admin-ajax.php')) {
            console.log('>>>> Headers1', {method});
            const arr = route.request().url().split(/([&?;,]|:\w|url)/);
            console.log(`${arr[0]}${arr.length>1 ? '?' : ''}`, JSON.stringify(headers, null, 2));
          }
          route.continue({});
        });
      } else {
        bcontext.route(/.*/, (route, request) => {
          routes({route, request, bcontext, browserName});
        });
      }
      await sleep(400);
      await page.goto(argv.url)
      page.on('close', () => {
        process.exit();
      });

      bcontexts[browserName] = bcontext;
      browsers[browserName] = browser;
      pages[browserName] = page;
    }

    // exitHook(async function() {
    //   await browser.close();
    // })
    
    global.mitm.browsers = browsers;
    global.mitm.pages = pages;
  })();  
}
//  mitm-play --logurl --url='twitter.com/search?q=covid&src=typed_query' --save=twl
