export default {
  version: '1.0.0',
  platform: {
    baseURL: 'https://api.saas-plat.com/v1',
    connection: '/app/connection',
    assets: '/app/assets',
    module: '/app/module',
    view: '/app/view',
    statistics: '/app/log',
    account: '/usr/account',
    server: '/server/connection',
    socketio: '/socketio'
  },
  server: {
    query: '/core/query',
    command: '/core/command',
    connection: '/core/connection',
    socketio: '/core/socketio'
  }
};
