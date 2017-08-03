import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../../config';

export function mock(axios) {

  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios);

  axios.interceptors.request.use(config => {
    console.log(config.method+' '+config.url);
    return config;
  });

  mock.onGet(config.server.connection).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onPost(config.server.command).reply(200, {
    errno: 0,
  });

  mock.onGet(config.server.query).reply(200, {
    errno: 0,
    data: {

    }
  });

}
