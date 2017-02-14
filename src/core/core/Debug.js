import EventEmitter from 'react-native/Libraries/EventEmitter/EventEmitter';
import stringifySafe from 'react-native/Libraries/Utilities/stringifySafe';
import {tx} from '../utils/internal';

const _debuggingEmitter = new EventEmitter();
const _debuggingList = [];

function sprintf(format, ...args) {
  var index = 0;
  return format.replace(/%s/g, match => args[index++]);
}

function formatMessage(format, ...args) {
  format = String(format);
  const argCount = (format.match(/%s/g) || []).length;
  return [
    sprintf(format, ...args.slice(0, argCount)),
    ...args.slice(argCount).map(stringifySafe)
  ].join(' ');
}

function updateDebuggingMap(format, ...args) {
  const debugging = formatMessage(format, ...args);
  _debuggingList.push(debugging);
  _debuggingEmitter.emit('debug', _debuggingList);
}

export const debuggingEmitter = _debuggingEmitter;
export const debuggingList = _debuggingList;

const {log, debug, warn, error} = console;

export function startDebug() {
  // 用户设备启用了调试模式需要显示console信息
  console.debug = (...args) => {
    debug.apply(console, args);
    updateDebuggingMap.apply(null, args);
  };
  console.log = (...args) => {
    if (args[0].indexOf('is already defined!') > -1)
      return;
    log.apply(console, args);
    updateDebuggingMap.apply(null, args);
  };
  console.warn = (...args) => {
    warn.apply(console, args);
    updateDebuggingMap.apply(null, args);
  };
  console.error = (...args) => {
    error.apply(console, args);
    updateDebuggingMap.apply(null, args);
  };
  warn(tx('DebugStart'));
}

export function stopDebug() {
  console.error = error;
  console.warn = warn;
  console.debug = debug;
  console.log = log;
  _debuggingList.length = 0;
  warn(tx('SebugStop'));
}
