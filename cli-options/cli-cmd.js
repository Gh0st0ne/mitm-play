const fs = require('fs-extra');

module.exports = () => {
  let {argv, fn: {clear}} = mitm;
  let arg = argv._[0] || 'default';
  arg = `${mitm.home}/argv/${arg}.js`;
  if (fs.existsSync(arg)) {
    const _argv = JSON.parse(fs.readFileSync(arg));
    global.mitm.argv = {..._argv, ...argv};
    argv = mitm.argv;
  }
  
  fs.ensureDir(mitm.home, err =>{});

  if (!argv.browser || ['firefox','webkit'].indexOf(argv.browser)===-1) {
    argv.browser = 'chromium';
  } else {
    fs.ensureDir(`${mitm.home}/.${argv.browser}`, err => {});
  }
  
  if (typeof(argv.go)!=='string') {
    argv.go = 'http://whatsmyuseragent.org/';
  }
  if (!argv.go.match('http')) {
    argv.go = `https://${argv.go}`;
  }

  if (!argv.script) {
    argv.script = `${process.cwd()}/script`.replace(/\\/g, '/');
  }
  // const {host, pathname} = new URL(argv.go);
  // argv.userscript = `${argv.script}/${host}/*.js`;
  argv.userscript = `${argv.script}/**/*.js`;

  clear();

  if (argv.save) {
    const { save, ...rest } = argv;
    const fpath = `${mitm.home}/argv/${save===true ? 'default' : save}.js`;
    const body = JSON.stringify(rest, null, 2);
    fs.ensureFile(fpath, err => {
      fs.writeFile(fpath, body, err => {});
    });
  }  
};
