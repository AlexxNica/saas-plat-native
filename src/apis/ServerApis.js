import axios from 'axios';
import assert from 'assert';
import config from '../config';
import {tx, trimEnd} from '../utils/internal';

class ServerApi {

  constructor(url, token) {
    this.url = trimEnd(url);

    this.proxy = axios.create({baseURL: this.url});

    this.authorization(token);

    // Add a response interceptor
    this.proxy.interceptors.response.use((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          return response.data.data;
        } else {
          return Promise.reject(new Error(response.data.errno, response.data.errmsg));
        }
      }
      return null;
    }, (error) => {
      // Do something with response error
      return Promise.reject(error);
    });

    if (__DEV__ && __MOCK__) {
      require('./mock/ServerMock').mock(this.proxy);
    }
  }

  authorization(token) {
    this.proxy.defaults.headers.common.Authorization = token;
    if (token) {
      // 只有token后服务器才允许连接
      this.openSocket();
    }
  }

  openSocket() {
    var socket = require('socket.io-client')(this.url + config.server.socketio);
    // socket.on('connect', function() {});
    // socket.on('event', function(data) {});
    // socket.on('disconnect', function() {});
  }

  test() {
    return this.proxy.get(config.server.connection);
  }

  query(module, name, ...args) {
    return this.proxy.get(config.server.query, {
      params: {
        name,
        module,
        ...args
      }
    });
  }

  command(module, command, ...args) {
    return this.proxy.post(config.server.command, {
      params: {
        name,
        module,
        ...args
      }
    });
  }

  // 等待业务处理完成通知
  wait(module, event, timeout = 60000) {}

}

let instance = null;

export function isConnected() {
  return !!instance;
}

export function connect(url, token) {
  assert(url);
  instance = new ServerApi(url, token);
}

function checkServer() {
  if (instance === null) {
    throw new Error(404, tx('服务器尚未连接无法访问'));
  }
}

export function authorization(token) {
  checkServer();
  return instance.authorization(token);
}

export function command(...args) {
  checkServer();
  return instance.command(...args);
}

export function query(...args) {
  checkServer();
  return instance.query(...args);
}

export function wait(...args) {
  checkServer();
  return instance.wait(...args);
}

export class Apis {
  static request(config) {
    checkServer();
    return instance.proxy.request(config);
  }

  static get(url, config) {
    checkServer();
    return instance.proxy.request(url, config);
  }

  static delete(url, config) {
    checkServer();
    return instance.proxy.request(url, config);
  }

  static head(url, config) {
    checkServer();
    return instance.proxy.request(url, config);
  }

  static options(url, config) {
    checkServer();
    return instance.proxy.request(url, config);
  }

  static post(url, data, config) {
    checkServer();
    return instance.proxy.request(url, data, config);
  }

  static put(url, data, config) {
    checkServer();
    return instance.proxy.request(config);
  }

  static patch(url, data, config) {
    checkServer();
    return instance.proxy.request(config);
  }
}
