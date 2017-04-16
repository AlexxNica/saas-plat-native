import lzwcompress from 'lzwcompress';
//import {Buffer} from 'buffer';
import RouterStore from '../stores/Router';
import UserStore from '../stores/User';
import {tx} from './internal';
import * as apis from '../apis/PlatformApis';
import device from '../core/Device';

class Statistics {
  constructor() {
    this.logs = [];

    // 记录用户使用的设备
    setTimeout(() => {
      this.log({
        how: 'use',
        what: device.deviceId,
        systemVersion: device.systemVersion,
        readableVersion: device.readableVersion,
        deviceLocale: device.deviceLocale,
        deviceCountry: device.deviceCountry
      });
    });

    // 记录日志活动 inject(console.debug, this.logConsole.bind(this, 'debug'));  //
    // 调试信息不收集
    this.injectConsele('info');
    this.injectConsele('warn');
    this.injectConsele('error');

    // 定时发送
    this.startTimer();
  }

  injectConsele(level) {
    this.logConsole.bind(this, level);
    const oldLoger = console[level];
    const me = this;
    console[level] = (...args) => {
      let msg = '';
      for (let i = 0; i < args.length; i++) {
        if (i !== 0) {
          msg += '\n';
        }
        msg += args[i];
      }
      if (__DEV__) {
        // 调试器bug忽略
        if (msg === 'Attempted to transition from state `RESPONDER_INACTIVE_PRESS_IN` to `RESPONDER_A' +
            'CTIVE_LONG_PRESS_IN`, which is not supported. This is most likely due to `Toucha' +
            'ble.longPressDelayTimeout` not being cancelled.' || msg === 'Remote debugger is in a background tab which may cause apps to perform slowly. F' +
            'ix this by foregrounding the tab (or opening it in a separate window).') {
          return;
        }
      }
      me.logConsole(level, msg); // 多个参数连接成字符串
      oldLoger.apply(console, args);
    };
  }

  logConsole(level, msg) {
    if (!msg || (!msg.message && !msg.stack)) {
      return; // 啥也没有就不记录
    }
    const isstring = typeof msg === 'string';
    this.log({
      how: 'log',
      what: isstring
        ? msg
        : msg.message,
      level,
      stack: !isstring && msg.stack
    });
  }

  startTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(this.sendLogsNow.bind(this), 5 * 60 * 1000); // 每5分钟发送一次
  }

  sendLogsNow() {
    if (this.logs.length <= 0) {
      return;
    }
    const data = new Buffer(lzwcompress.pack(this.logs)).toString('base64');
    this.logs = []; // 日志需要清空，要不会越来越大
    try {
      apis.sendLogs(data);
      console.log(tx('Saved'));
    } catch (err) {
      console.log(tx('SaveFail'));
    }
    this.startTimer();
  }

  send() {
    if (this.logs.length > 100) {
      this.sendLogsNow();
      return true;
    }
    return false;
  }

  // 几点几分谁在哪做了什么
  log({
    when,
    who,
    where,
    how,
    what,
    ...other
  }) {
    const store = RouterStore.getStore();
    const module = store.currentBundle || {};
    const scene = store.currentScene || {};
    const user = UserStore.getStore().user || {};
    this.logs.push({
      id: device.uniqueID,
      when: when || (new Date()).getTime(),
      who: who || user.name,
      where: where || scene.name,
      how,
      what,
      data: {
        module: module.name,
        version: module.version,
        ...other
      }
    });
    this.send();
  }
}
export default new Statistics();
