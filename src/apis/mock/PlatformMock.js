import MockAdapter from 'axios-mock-adapter';
import config from '../../config';

export function mock(axios) {

  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios);

  mock.onGet(config.platform.connection).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.assets).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onPost(config.platform.log).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.account).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.server).reply(200, {
    errno: 0,
    data: {}
  });

}
