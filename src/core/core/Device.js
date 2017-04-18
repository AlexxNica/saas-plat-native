import {Platform} from 'react-native';

let uniqueID;
let deviceId;
let systemVersion;
let readableVersion;
let deviceLocale;
let deviceCountry;

switch (Platform.OS) {
  case 'android':
  case 'ios':
    const DeviceInfo = require('react-native-device-info');
    uniqueID = DeviceInfo.getUniqueID(); // FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
    deviceId = DeviceInfo.getDeviceId(); // iPhone7,2
    systemVersion = DeviceInfo.getSystemVersion(); // 9.0
    readableVersion = DeviceInfo.getReadableVersion(); // 1.1.0.89
    deviceLocale = DeviceInfo.getDeviceLocale(); // en-US
    deviceCountry = DeviceInfo.getDeviceCountry(); // US
    break;
  case 'web':
    const browser = {};
    if (/(msie|rv|chrome|firefox|opera|netscape)\D+(\d[\d.]*)/.test(navigator.userAgent.toLowerCase())) {
      browser.name = RegExp.$1;
      browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(navigator.userAgent.toLowerCase())) {
      browser.name = 'safari';
      browser.version = RegExp.$2;
    } else {
      browser.name = 'unknown';
      browser.version = '';
    }

    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac)
      browser.systemVersion = "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix)
      browser.systemVersion = "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux)
      browser.systemVersion = "Linux";
    if (isWin) {
      var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
      if (isWin2K)
        browser.systemVersion = "Win2000";
      var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
      if (isWinXP)
        browser.systemVersion = "WinXP";
      var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
      if (isWin2003)
        browser.systemVersion = "Win2003";
      var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
      if (isWinVista)
        browser.systemVersion = "WinVista";
      var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
      if (isWin7)
        browser.systemVersion = "Win7";
      var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
      if (isWin10)
        browser.systemVersion = "Win10";
      }
    browser.systemVersion = "other";

    uniqueID = '$ip';
    deviceId = browser.name;
    systemVersion = browser.systemVersion;
    readableVersion = browser.version;
    deviceLocale = navigator.language || navigator.browserLanguage; // en-US
    const sp = (navigator.language || navigator.browserLanguage).split('-');
    deviceCountry = sp[1] || sp[0];
    break;
  case 'windows':
    // todo
  case 'macos':
    // todo
  default:
    console.error(tx('不支持的平台设备'), Platform.OS);
}

export default {
  uniqueID,
  deviceId,
  systemVersion,
  readableVersion,
  deviceLocale,
  deviceCountry
};
