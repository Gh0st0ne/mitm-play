const c = require('ansi-colors');
const {spliter,fn: {tldomain,nameSpace}} = global.mitm;

function thirdparty({url, headers}) {
  const {origin, referer} = headers;
  const domain = tldomain(url);

  if (!nameSpace(domain)) {
    if (origin && nameSpace(origin)) return;
    if (referer && nameSpace(referer)) return;
    console.log(c.redBright(`>> no-namespace (${url.split(spliter)[0]})`));
    return true;
  }
}

module.exports = thirdparty;