function argsChg(id, key) {
  let {argv} = mitm;
  if (argv[id]) {
    argv[key] = argv[id];
    delete argv[id];
  }
}

function browser(id) {
  let {argv} = mitm;
  if (argv[id]) {
    argv.browser = id;
    if (typeof(argv[id])==='string') {
      argv.executablePath = argv[id];
    }
    delete argv[id];
    return true;
  }  
}

module.exports = () => {
  let {argv, fn: {clear}} = mitm;

  argsChg('g', 'go');
  argsChg('h', 'help');
  argsChg('s', 'save');
  argsChg('c', 'cache');
  argsChg('d', 'delog');
  argsChg('r', 'route');
  argsChg('l', 'logurl');
  argsChg('b', 'browser');
  argsChg('z', 'lazylog');
  argsChg('p', 'pristine');
  argsChg('n', 'nosocket');

  if (!argv.browser || ['firefox','webkit'].indexOf(argv.browser)===-1) {
    argv.browser = 'chromium';
  }

  let br = browser('chromium');
  !br && (br = browser('webkit'));
  !br && (br = browser('firefox'));
}
