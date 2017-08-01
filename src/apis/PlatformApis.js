import { Platform } from 'react-native';
import config from '../config';
import { fetchJson } from '../utils/helper';
import device from '../core/Device';
import Screen from '../core/Screen';

const deviceID = device.deviceID;

export function connectPlatform(enterpriseId) {
  return fetchJson({ url: `config.platform.connection?tid=${enterpriseId}&did=${deviceID}&os=${Platform.OS}` });
}

export function sendLogs(data) {
  return fetchJson({
    url: config.platform.statistics,
    options: {
      method: 'POST',
      // headers: {  "Content-Type": "application/json" },
      body: data
    },
    withToken: false
  });
}

export function loginPlatUser(encUsername, passwordHash) {
  return fetchJson({ url: `${config.platform.account}?name=${encUsername}&passwordHash=${passwordHash}` });
}

export function loginPlatUserToken(token) {
  return fetchJson({ url: `${config.platform.account}?token=${token}` });
}

export function findServer(id) {
  return fetchJson({ url: `${config.platform.server}?sid=${id}&did=${deviceID}&os=${Platform.OS}&v=${device.systemVersion}&s=${Screen.Size}` });
}
