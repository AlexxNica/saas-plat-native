const server = __DEV__
  ? 'http://test.saas-plat.com:8200/api/v1'
  : 'https://api.saas-plat.com/v1';

export default {
  version : server + '/app/version',
  dev : server + '/app/dev'
};
