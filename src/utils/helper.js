import assert from 'assert';
import { Platform } from 'react-native';
import * as decorators from 'core-decorators';
import i18next from 'i18next';
import UserStore from '../stores/User';
import SystemStore from '../stores/System';
import ThemeStore from '../stores/Theme';
import I18nStore from '../stores/I18n';
import RouterStore from '../stores/Router';
import MessageStore from '../stores/Message';
import ServerStore from '../stores/Server';
import ModuleStore from '../stores/Module';

import * as theme from '../core/Theme';
import * as i18n from '../core/I18n';
import * as Store from '../core/Store';

// ************** stores *********************

export const userStore = UserStore.getStore(); // 用户参数
export const systemStore = SystemStore.getStore(); // 系统参数
export const themeStore = ThemeStore.getStore(); // 主题
export const i18nStore = I18nStore.getStore(); // 多语言
export const routerStore = RouterStore.getStore(); // 路由
export const messageStore = MessageStore.getStore(); // 消息服务
export const serverStore = ServerStore.getStore(); // 服务器
export const moduleStore = ModuleStore.getStore();

// *************** local && theme ******************

export const t = i18next.tx;

export const translate = i18n.translate;
export const connectStyle = theme.connectStyle;
export const connectStore = Store.connectStore;

export const autobind = decorators.autobind;

export const connect = (local, theme, store, obser = true, atob = true) => {
  let storeObj;
  if (typeof store === 'string') {
    storeObj = { appStore: store };
  } else {
    storeObj = store;
  }
  return WarppedComponent => {
    assert(WarppedComponent);
    let ConnectedComponent = WarppedComponent;
    if (atob) {
      autobind(ConnectedComponent);
    }
    if (obser) {
      ConnectedComponent = observer(ConnectedComponent);
    }
    if (store) {
      ConnectedComponent = connectStore(storeObj)(ConnectedComponent);
    }
    if (theme) {
      ConnectedComponent = connectStyle(theme)(ConnectedComponent);
    }
    if (local) {
      ConnectedComponent = translate(local)(ConnectedComponent);
    }
    return ConnectedComponent;
  };
};

// ******************* mobx ********************

export const observer = Platform.OS === 'web' ?
  require('mobx-react').observer :
  require('mobx-react/native').observer;

// ******************* router ******************************

let RouterInternal,
  RouteInternal,
  SwitchInternal,
  LinkInternal,
  RedirectInternal;
switch (Platform.OS) {
  case 'android':
  case 'ios':
  case 'windows':
  case 'macos':
    {
      const NativeRouter = require('react-router-native');
      RouterInternal = NativeRouter.NativeRouter;
      RouteInternal = NativeRouter.Route;
      SwitchInternal = NativeRouter.Switch;
      LinkInternal = NativeRouter.Link;
      RedirectInternal = NativeRouter.Redirect;
      break;
    }
  case 'web':
    {
      const BrowserRouter = require('react-router-dom');
      RouterInternal = BrowserRouter.BrowserRouter;
      RouteInternal = BrowserRouter.Route;
      SwitchInternal = BrowserRouter.Switch;
      LinkInternal = BrowserRouter.Link;
      RedirectInternal = BrowserRouter.Redirect;
      break;
    }
  default:
    console.error(tx('不支持的路由平台'), Platform.OS);
    break;
}

export const Router = RouterInternal;
export const Route = RouteInternal;
export const Switch = SwitchInternal;
export const Link = LinkInternal;
export const Redirect = RedirectInternal;

// // ********************** fetch utils ******************************
//
// const ntCacheName = 'ntcache@';
//
// function loadFromCache(user, url) {
//   return new Promise((resolve, reject) => {
//     storage.load({
//       key: ntCacheName + (user || 'guest'),
//       id: url,
//       autoSync: false
//     }).then((ret) => {
//       resolve(ret);
//     }).catch((err) => {
//       // 如果没有找到数据且没有sync方法， 或者有其他异常，则在catch中返回
//       switch (err.name) {
//         case 'NotFoundError':
//           resolve(null);
//           break;
//         case 'ExpiredError':
//           resolve(null);
//           break;
//         default:
//           console.warn(err.message);
//           reject(internal.tx('缓存加载失败'));
//       }
//     });
//   });
// }
//
// function saveToCache(user, url, data) {
//   storage.save({
//     key: ntCacheName + (user || 'guest'),
//     id: url,
//     rawData: data,
//     // 如果不指定过期时间，则会使用defaultExpires参数 如果设为null，则永不过期
//     expires: null
//   });
// }
//
// // 是否启用fetch缓存的全局设置
// global.enableFetchCache = true;
//
// export function fetchJson({
//   url,
//   options,
//   withCache = true,
//   withToken = true
// }) {
//   return sendFetch({ url, options, withCache, withToken, repContextType: 'json' });
// }
//
// export function sendFetch({
//   url,
//   options,
//   withCache = true,
//   withToken = true,
//   repContextType = 'json'
// }) {
//   assert(url);
//   // 如果没有网络，尝试从缓存中加载数据
//   if (!global.isConnected && withCache && global.enableFetchCache) {
//     return loadFromCache(UserStore.getStore().getToken(), url);
//   }
//   return new Promise((resolve, reject) => {
//     const optionsWithToken = {
//       ...options
//     };
//     if (withToken) {
//       optionsWithToken.headers = {
//         sptoken: UserStore.getStore().getToken(),
//         ...optionsWithToken.headers
//       };
//     }
//     fetch(url, optionsWithToken).then((response) => {
//       if (!response.ok) {
//         throw new Error(
//           `${internal.tx('网络连接失败')} (${response.status})`);
//       }
//       if (repContextType === 'json') {
//         return response.text().then((text) => {
//           if (!text) {
//             return {};
//           }
//           return JSON.parse(text);
//         });
//       } else {
//         return response.text();
//       }
//     }).then((responseJson) => {
//       if (repContextType) {
//         if (!responseJson.errno) {
//           if (withCache) {
//             saveToCache(UserStore.getStore().getToken(), url,
//               responseJson.data);
//           }
//           resolve(responseJson.data);
//         } else {
//           console.log(internal.tx('网络连接失败'));
//           console.warn(responseJson.errmsg);
//           reject(responseJson.errmsg);
//         }
//       } else {
//         resolve(responseJson);
//       }
//     }).catch((err) => {
//       console.log(internal.tx('网络连接失败'), url);
//       console.error(err);
//       reject(internal.tx('网络连接失败'));
//     });
//   });
// }
//
// export function toQueryString(obj) {
//   return obj ?
//     Object.keys(obj).sort().map((key) => {
//       var val = obj[key];
//       if (Array.isArray(val)) {
//         return val.sort().map((val2) => {
//           return `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`;
//         }).join('&');
//       }
//       return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
//     }).join('&') :
//     '';
// }
//
// export function connectUrl(url, path, args) {
//   assert(url);
//   assert(path);
//   let fullurl = `${url.trimRight('/')}/${path.trimLeft('/')}`;
//   if (args) {
//     const qs = toQueryString(args);
//     if (qs) {
//       fullurl = fullurl.trimRight('?').trimRight('&');
//       if (fullurl.indexOf('?') > -1) {
//         fullurl += `&${qs}`;
//       } else {
//         fullurl += `?${qs}`;
//       }
//     }
//   }
//   return fullurl;
// }
//
// // fetch with user token header
// export function fetchServer({
//   url,
//   headers,
//   data,
//   method = 'get',
//   withCache = true,
//   withToken = true,
//   repContextType = 'json'
// }) {
//   assert(url);
//   const server = ServerStore.getStore().currentServer;
//
//   if (!server || !server.address) {
//     throw internal.tx('服务器无法连接');
//   }
//
//   return sendFetch({
//     url: connectUrl(server.address, url, (method === 'get' ?
//       data :
//       '')),
//     options: {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers
//       },
//       body: method === 'post' ?
//         toQueryString(data) : undefined
//     },
//     withCache,
//     withToken,
//     repContextType
//   });
//
// }

// export function fetchPlatform({
//   url,
//   headers,
//   data,
//   method = 'get',
//   withCache = true,
//   withToken = true,
//   repContextType = 'json'
// }) {
//   assert(url);
//
//   return sendFetch({
//     url: connectUrl(config.platform.address, url, (method === 'get'
//       ? data
//       : '')),
//     options: {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers
//       },
//       body: method === 'post'
//         ? toQueryString(data)
//         : undefined
//     },
//     withCache,
//     withToken,
//     repContextType
//   });
// }
