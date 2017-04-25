import { Platform, Dimensions } from 'react-native';
import config from '../config';
import { fetchJson } from '../utils/helper';
import device from '../core/Device';
const { width } = Dimensions.get('window');

const ScreenTypes = [
  [
    'xxs', 312
  ], // 手表
  [
    'xs', 768
  ], // 手机
  ['sm': 992], // PAD
  [
    'md', 1200
  ], // PC MAC
  [
    'lg', 999999
  ], // TV LED
];

const screen = ScreenTypes.find(item => width < item[1]);
const deviceID = device.deviceID;

export function connectPlatform() {
  return fetchJson({ url: config.platform.connection });
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
  return fetchJson({ url: `${config.platform.server}?id=${id}&did=${deviceID}&os=${Platform.OS}&v=${device.systemVersion}&s=${screen}` });
}
