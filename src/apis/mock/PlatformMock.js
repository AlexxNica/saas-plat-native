import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import config from '../../config';

const mores = [];
let mockAdapter;

export function mock(axios) {

  // This sets the mock adapter on the default instance
  var mockAdapter = new MockAdapter(axios);

  axios.interceptors.request.use(config => {
    console.log(config.method + ' ' + config.url);
    return config;
  });

  mockAdapter.onGet(config.platform.connection).reply(200, {
    errno: 0,
    data: {
      // 返回服务器地址
      server: 'https://server.saas-plat.com/testserver1',
      // 各个模块注册的路由表
      routemap: [
        {
          ns: 'saas-plat-native-login',
          path: ''
        }, {
          ns: 'saas-plat-native-portal',
          path: ''
        }, {
          ns: 'saas-plat-erp-purchase-order-native',
          path: 'purchase/order'
        }
      ]
    }
  });

  mockAdapter.onGet(config.platform.assets).reply(200, {
    errno: 0,
    data: {}
  });

  mockAdapter.onPost(config.platform.log).reply(200, {errno: 0});

  mockAdapter.onGet(config.platform.account).reply(200, {
    errno: 0,
    data: {
      "id": 11001,
      "name": "testuser1",
      "profiles": {},
      "roles": [],
      "token": {
        "data": "aaaaaaaaaabbbbbbbbbbbccccccccccccccccceeeeeeeeeeeeeeeeffffffffffffffffffffffffff" +
            "ffffffffffff"
      },
      "currentServer": "server1",
      "servers": [
        {
          "id": "server1",
          "name": "server1",
          "role": "administrator",
          "options": {}
        }, {
          "id": "server2",
          "name": "server2",
          "role": "user",
          "options": {}
        }
      ]
    }
  });

  mockAdapter.onGet(config.platform.server).reply(200, {
    errno: 0,
    data: {}
  });

  mockAdapter.onGet(config.platform.module).reply(200, Mock.mock({
    errno: 0,
    'data|10': [
      {
        id: Mock.Random.integer(1000, 10000),
        name: Mock.Random.word(),
        icon: 'https://www.saas-plat.com/img/favicon.png',
        url: '/saas-plat-erp-purchase-order-native',
        defaultView: 'viewMode',
        text: Mock.Random.cparagraph(1, 3),
        'order|+1': 1
      }
    ]
  }));

  mockAdapter.onGet(config.platform.view).reply(config => [
    200,
    Mock.mock({
      errno: 0,
      'data': {
        id: Mock.Random.integer(1000, 10000),
        mId: config.params.mId,
        name: config.params.name,
        text: Mock.Random.cparagraph(1, 3)
      }
    })
  ]);

  mores.forEach(fn => fn(mockAdapter, config));
}

export function addMock(callback) {
  if (mockAdapter) {
    callback(mockAdapter, config);
  } else {
    mores.push(callback);
  }
}
