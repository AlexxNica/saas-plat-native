import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
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
    errno: 0
  });

  mock.onGet(config.platform.account).reply(200, {
    errno: 0,
    data: {
      "id": 11001,
      "name": "testuser1",
      "profiles": {},
      "roles": [],
      "token": {
        "data": "aaaaaaaaaabbbbbbbbbbbccccccccccccccccceeeeeeeeeeeeeeeeffffffffffffffffffffffffffffffffffffff"
      },
      "currentServer": "server1",
      "servers": [{
        "id": "server1",
        "name": "server1",
        "role": "administrator",
        "options": {}
      }, {
        "id": "server2",
        "name": "server2",
        "role": "user",
        "options": {}
      }]
    }
  });

  mock.onGet(config.platform.server).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.module).reply(200, Mock.mock({
    errno: 0,
    'data|1-10': [{
      id: Mock.Random.integer(1000, 10000),
      'name': Mock.Random.word(5),
      icon: null,
      text: Mock.Random.cparagraph(1, 3),
      'order|+1': 1
    }]
  }));

  mock.onGet(config.platform.view).reply(200, Mock.mock({
    errno: 0,
    data: {
      id: Mock.Random.integer(1000, 10000),
      name: Mock.Random.word(5),
      text: Mock.Random.cparagraph(1, 3),
      url: Mock.Random.url('/', 'testmodule'),
      config: {}
    }
  }));
}
