module.exports = (typ, {url, headers}) => {
  const nod = mitm.route[typ];
  let arr;
  let log;

  for (let key in nod) {
    if (typ==='logs' || typ==='cache') {
      log = `>> ${typ} (${headers['content-type']}).match(${key})`;
      arr = (headers['content-type']+'').match(key);
    } else {
      const split = url.split(/([&?;,]|:\w|url)/);
      const path = `${split[0]}${split.length>1 ? '?' : ''}`;
      log = `>> ${typ} (${path}).match(${key})`;
      arr = url.match(key);
    }
    if (arr && nod[key]) {
      return {
        rt: nod[key],
        arr,
        url,
        nod,
        key,
        log,
      }
    }
  }
}
