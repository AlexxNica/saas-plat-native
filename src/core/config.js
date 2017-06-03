const server = __DEV__
  ? 'http://localhost:8200/api/v1'
  : 'http://api.saas-plat.com/v1';

const file = __DEV__
  ? 'http://localhost:8200/api/v1'
  : 'http://file.saas-plat.com';

export default {
  version : '1.0.0',
  platform : {
    address: server,
    chat: server + '/chat',
    connection: server + '/app/connection',
    bundle: file,
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
