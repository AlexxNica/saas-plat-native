import { Platform } from 'react-native';
import axios from 'axios';
import config from '../config';
import device from '../core/Device';
import Screen from '../core/Screen';

const instance = axios.create({
  baseURL: config.platform.baseURL
});

export function authorization(token) {
  instance.defaults.headers.common['Authorization'] = token;
}

// instance.interceptors.request.use( (config)=> {
//
//   return config;
// },   (error) =>{
//     // Do something with request error
//     return Promise.reject(error);
// });

if (__DEV__ && __MOCK__) {
  require('./mock/PlatformMock').mock(instance);
}

export function connect(enterpriseId = '') {
  return instance.get(
    config.platform.connection, {
      params: {
        tid: enterpriseId,
        did: device.deviceId,
        os: Platform.OS
      }
    }
  );
}

export function sendLogs(data) {
  return instance.post(config.platform.statistics, data);
}

export function login(encUsername, passwordHash) {
  return instance.get(
    config.platform.account, {
      params: {
        name: encUsername,
        passwordHash: passwordHash
      }
    }
  );
}

export function loginToken(token) {
  return instance.get(config.platform.account, {
    params: {
      token
    }
  });
}

export function findServer(id) {
  return instance.get(
    config.platform.server, {
      params: {
        sid: id,
        did: device.deviceId,
        os: Platform.OS,
        v: device.systemVersion,
        s: Screen.Size
      }
    }
  );
}

export default instance;
