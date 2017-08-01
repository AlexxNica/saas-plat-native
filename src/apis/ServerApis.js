import config from '../config';
import {fetchServer, toQueryString} from '../utils/helper';

export function testServer() {
  return fetchServer({url: config.server.connection});
}

export function queryData(name, args) {
  const filter = toQueryString(args);
  let filterArg = '';
  if (filter) {
    filterArg = `&filter=${filter}`;
  }
  return fetchServer({url: `${config.server.query}?table=${name}${filterArg}`});
}
