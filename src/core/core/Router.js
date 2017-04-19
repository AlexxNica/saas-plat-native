import { Platform } from 'react-native';
import { tx } from '../utils/internal';

switch (Platform.OS) {
  case 'android':
  case 'ios':
    const Native = require('react-router-native');
    export const Router = Native.NativeRouter;
    export const Route = Native.Route;
    export const Switch = Native.Switch;
    export const Link = Native.Link;
    break;
  case 'web':
    const Browser = require('react-router-dom');
    export const Router = Browser.BrowserRouter;
    export const Route = Browser.Route;
    export const Switch = Browser.Switch;
    export const Link = Native.Link;
    break;
  case 'windows':
  case 'macos':
  default:
    console.error(tx('不支持的平台路由',Platform.OS));
}
