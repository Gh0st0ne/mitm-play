// to preseve indentation when stringify
const {
  mock,
  resp,
  googlJS,
  helloMitm
} = {
mock: function() {
  return {body: 'Hi there!'}
},
resp: function() {
  return {};
},
googlJS: function() {
  // remove unecessary html elements from google search result
  document.querySelectorAll('g-section-with-header').forEach(n=>n.remove())
  document.querySelectorAll('.obcontainer').forEach(n=>n.remove())
  document.querySelectorAll('.g-blk').forEach(n=>n.remove())
},
helloMitm: function() {
  console.log('Hello from mimt-play');
},
};

function routeSet(routes2, namespace, print=false) {
  const {
    fn: {stringify},
    routes: routes1,
  } = global.mitm;

  if (!routes1[namespace]) {
    routes1[namespace] = {};
  }

  for (let typ in routes2) {
    if (!routes1[namespace][typ]) {
      routes1[namespace][typ] = {};
    }

    const route1 = routes1[namespace][typ];
    const route2 = routes2[typ];

    if (route1) {
      for (let key in route2) {
        if (route1[key]) {
          delete route1[key];
        }
      }
      routes1[namespace][typ] = {
        ...route2,
        ...route1,
      }
    } else {
      routes1[namespace][typ] = routes2[typ];
    }
  }

  console.log(`>> ${namespace}\n${stringify(routes1[namespace])}`);
  return routes1[namespace];
};

const _initWebsocket = require('../socketclnt');

const routes = {
  default: {
    // cache: {
    //   // 'application/x-ww': { ext: '.json' }
    // },
    // logs: {
    //   // 'application/json': { ext: '.json' },
    // },
    skip: {
      '.(jpeg|jpg|png|svg|gif|ico|mp4)': {},
    },
    mock: {
      '/mock': {resp: mock},
      '/mitm-play/websocket.js': {
        js: [_initWebsocket],
      },  
    },
    html: {
      'www.google.com/search': {
        // resp,
        el: 'e_end', //or e_head
        js: [googlJS, helloMitm], //JS is injected at the end of html body
      },
    },
    // js: {
    //   '.js$': {resp},
    // },
  }
};

module.exports = () => {
  global.mitm.routes = routes;
  global.mitm.fn.resp = resp;
  global.mitm.fn.routeSet = routeSet;
  //https://twitter.com/search?q=covid&src=typed_query  
};
