const server = __DEV__
  ? 'http:/localhost:8202/api/v1'
  : 'http:/api.saas-plat.com/v1';

export default {
  version : '1.0.0',
  platform : {
    address: server,
    connection: server + '/app/connection',
    bundle: server + '/bundle/file',
    map: server + '/bundle/map',
    assets: server + '/app/assets',
    statistics: server + '/app/log',
    account: server + '/usr/account',
    server: server + '/server/connection'
  },
  server : {
    query: 'core/query',
    connection: 'core/connection'
  }
};
