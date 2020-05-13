const fs = require('fs-extra');
const _match = require('./match');

function cacheResponse(arr, reqs) {
  const match = _match('cache', reqs);
  if (match) {
    const { url } = reqs;
    const {host, pathname} = match;
    const p = pathname.replace('/', '_');
    const stamp1 = `${host}/${p}`;
    const stamp2 = `${host}/resp/${p}`;
    const fpath1 = `${mitm.home}/cache/${stamp1}${match.route.ext}`;
    const fpath2 = `${mitm.home}/cache/${stamp2}.json`;
    if (fs.existsSync(fpath1)) {
      const body = fs.readFileSync(fpath1);
      const {status, headers} = JSON.parse(fs.readFileSync(fpath2));
      return {status, headers, body};
    } else {
      arr.push(resp => { 
        const {body, ...r} = resp;
        const resp2 = JSON.stringify(r, null, 2);
        fs.ensureFile(fpath1, err => {
          fs.writeFile(fpath1, body, err => {
            err && console.log('>> Error write cache1', err);
          })
        })
        fs.ensureFile(fpath2, err => {
          fs.writeFile(fpath2, resp2, err => {
            err && console.log('>> Error write cache2', err);
          })
        })
        return resp; 
      });  
    }
  }
}

module.exports = cacheResponse;
