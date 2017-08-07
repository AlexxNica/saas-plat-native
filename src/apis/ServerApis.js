import axios from 'axios';
import assert from 'assert';
import io from 'socket.io-client';
import config from '../config';
import { tx, trimEnd } from '../utils/internal';

class ServerApi {
  eventHandlers = [];

  constructor(url, token) {
    this.url = trimEnd(url);

    this.proxy = axios.create({ baseURL: this.url });

    this.authorization(token);

    // Add a response interceptor
    this.proxy.interceptors.response.use((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          return response.data.data;
        } else {
          return Promise.reject(new Error(response.data.errno, response.data
            .errmsg));
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
    let socketio = io;
    if (__DEV__ && __MOCK__) {
      socketio = require('./mock/ServerMock').mockSocket(this.url + config.server.socketio);
    }
    this.socket = socketio(this.url + config.server.socketio);
    this.socket.on('connect', () => {
      console.log(tx('Socket已经连接'));
    });
    this.socket.on('event', ({ module, event, data }) => {
      this.eventHandlers.filter(it =>
        (it.type === '*' || it.type === 'event') &&
        (it.module === '*' || it.module === module) &&
        (it.event === '*' || it.event === event)).forEach(
        it => {
          try {
            it.handler(data);
          } catch (err) {
            console.error(tx('消息处理失败'), err);
          }
        });
    });
    this.socket.on('disconnect', () => {
      console.log(tx('Socket已经断开'));
    });
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
  wait(module, event, timeout = 60000) {
    return new Promise((resolve, reject) => {
      const handler = {
        module,
        event,
        type: 'event',
        (data) => {
          if (timeDisp) {
            clearTimeout(timeDisp);
            timeDisp = null;
          }
          if (this.eventHandlers.indexOf(handler) > -1) {
            this.eventHandlers.splice(this.eventHandlers.indexOf(
              handler), 1);
          }
          resolve(data);
        }
      };
      this.eventHandlers.push(handler);
      const timeDisp = setTimeout(() => {
        timeDisp = null;
        if (this.eventHandlers.indexOf(handler) > -1) {
          this.eventHandlers.splice(this.eventHandlers.indexOf(
            handler), 1);
        }
        reject(tx('业务还未处理完毕，稍后再核实数据是否生效'));
      }, timeout);
    });
  }
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
