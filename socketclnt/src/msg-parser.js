const _client = require('./client');
const wccmd = _client();

module.exports = (event, msg) => {
  if (msg.length>40) {
    console.log('received: `%s...`', msg.slice(0,40));
  } else {
    console.log('received: `%s`', msg);
  }
  const arr = msg.replace(/\s+$/, '').match(/^ *(\w+) *(\{.*)/);
  if (arr) {
    let [,cmd,json] = arr;
    try {
      if (typeof(json)==='string') {
        json = JSON.parse(json);
      }
    } catch (error) {
      console.error(json,error);
    }        
    if (wccmd[cmd]) {
      console.log(json.data);
      wccmd[cmd].call(event, json)
    }       
  }    
}
