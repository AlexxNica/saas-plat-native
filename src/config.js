export default {
  version: '1.0.0',
  platform: {
    baseURL: 'https://api.saas-plat.com/v1',
    chat: '/chat',
    connection: '/app/connection',
    assets: '/app/assets',
    statistics: '/app/log',
    account: '/usr/account',
    server: '/server/connection'
  },
  server: {
    query: 'core/query',
    command: 'core/command',
    connection: 'core/connection'
  }
};
