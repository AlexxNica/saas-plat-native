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

// Add a response interceptor
instance.interceptors.response.use((response) => {
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
        passwordHash
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

export function loadModules() {
  return instance.get(config.platform.module, {
    params: {
      s: Screen.Size
    }
  });
}

export function loadView(name, mId) {
  return instance.get(
    config.platform.view, {
      params: {
        name,
        mId,
        s: Screen.Size
      }
    }
  );
}

export default instance;
