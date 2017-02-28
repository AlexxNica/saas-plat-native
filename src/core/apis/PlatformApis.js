import DeviceInfo from 'react-native-device-info';
import {Platform, Dimensions} from 'react-native';
import config from '../config';
import {fetchJson} from '../utils/helper';

const {width} = Dimensions.get('window');

const ScreenTypes = [
  [
    'xxs', 312
  ], // 手表
  [
    'xs', 768
  ], // 手机
  ['sm' : 992], // PAD
  [
    'md', 1200
  ], // PC MAC
  [
    'lg', 999999
  ], // TV LED
];

const screen = ScreenTypes.find(item => width < item[1]);
const deviceType = 'phone'; // todo tv ?
const deviceID = DeviceInfo.getDeviceId(); // iPhone7,2
//const deviceUUID = DeviceInfo.getUniqueID(); // FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
// systemVersion : DeviceInfo.getSystemVersion(), // 9.0  version :
// DeviceInfo.getReadableVersion(), // 1.1.0.89  locale :
// DeviceInfo.getDeviceLocale(), // en-US  country :
// DeviceInfo.getDeviceCountry(), // US

export function connectPlatform() {
  return fetchJson({
    url: config.platform.connection
  });
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
  return fetchJson({url: `${config.platform.account}?name=${encUsername}&passwordHash=${passwordHash}`});
}

export function findServer(id) {
  return fetchJson({url: `${config.platform.server}?id=${id}&dt=${deviceType}&os=${Platform.OS}&v=${Platform.version}&s=${screen}&did=${deviceID}`});
}
