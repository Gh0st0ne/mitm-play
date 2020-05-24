const c = require('ansi-colors');
const _match = require('./match');
const addReplaceBody = require('./add-replace-body');
const {matched,searchFN} = _match;

function cssResponse(arr, reqs) {
  const search = searchFN('css', reqs);
  const match = matched(search, reqs);
  if (match) {
    arr.push(resp => {
      const contentType = `${resp.headers['content-type']}`;
      if (contentType.match('text/css')) {
        console.log(c.blueBright(match.log));
        if (typeof(match.route)==='string') {
          resp.body = addReplaceBody(resp.body, match);
        } else {        
          let resp2;
          if (match.route.resp) {
            resp2 = match.route.resp(resp);
          }
          resp = {
            ...resp,
            ...resp2,
          };
        }
      }
      return resp;
    });
  }
}

module.exports = cssResponse;
