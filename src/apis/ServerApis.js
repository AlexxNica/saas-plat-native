import axios from 'axios';
import config from '../config';

const instance = axios.create({
  baseURL: config.platform.baseURL
});

export function authorization(token){
  instance.defaults.headers.common['Authorization'] = token;
}

if (__DEV__ && __MOCK__) {
  require('./mock/ServerMock').mock(instance);
}

export function test() {
  return instance.get(config.server.connection);
}

export function query(name, args) {
  return instance.get(config.server.query, {
    params: {
      name,
      args
    }
  });
}

export function command(name, args) {
  return instance.post(config.server.command, {
    params: {
      name,
      args
    }
  });
}

export default instance;
