import assert from 'assert';
import ServerStore from '../stores/Server';
import UserStore from '../stores/User';
import storage from './LocalStore';
import * as internal from './internal';

import * as theme from '../core/Theme';
import * as i18n from '../core/I18n';
import * as Store from '../core/Store';

export const tx = i18n.tx;

export const translate = i18n.translate;
export const connectStyle = theme.connectStyle;
export const connectStore = Store.connectStore;

// ********************** fetch utils ******************************

const ntCacheName = 'ntcache@';

function loadFromCache(user, url) {
  return new Promise((resolve, reject) => {
    storage.load({
      key: ntCacheName + (user || 'guest'),
      id: url,
      autoSync: false
    }).then((ret) => {
      resolve(ret);
    }).catch((err) => {
      // 如果没有找到数据且没有sync方法， 或者有其他异常，则在catch中返回
      switch (err.name) {
        case 'NotFoundError':
          resolve(null);
          break;
        case 'ExpiredError':
          resolve(null);
          break;
        default:
          console.warn(err.message);
          reject(internal.tx('NetworkNotConnectedNoCache'));
      }
    });
  });
}

function saveToCache(user, url, data) {
  storage.save({
    key: ntCacheName + (user || 'guest'),
    id: url,
    rawData: data,
    // 如果不指定过期时间，则会使用defaultExpires参数 如果设为null，则永不过期
    expires: null
  });
}

// 是否启用fetch缓存的全局设置
global.enableFetchCache = true;

export function fetchJson({
  url,
  options,
  withCache = true,
  withToken = true
}) {
  return sendFetch({url, options, withCache, withToken, repContextType:'json'});
}

export function sendFetch({
  url,
  options,
  withCache = true,
  withToken = true,
  repContextType = 'json'
}) {
  assert(url);
  // 如果没有网络，尝试从缓存中加载数据
  if (!global.isConnected && withCache && global.enableFetchCache) {
    return loadFromCache(UserStore.getStore().getToken(), url);
  }
  return new Promise((resolve, reject) => {
    const optionsWithToken = {
      ...options
    };
    if (withToken) {
      optionsWithToken.headers = {
        sptoken: UserStore.getStore().getToken(),
        ...optionsWithToken.headers
      };
    }
    fetch(url, optionsWithToken).then((response) => {
      if (!response.ok) {
        throw new Error(`${internal.tx('NetworkFailed')} (${response.status})`);
      }
      if (repContextType === 'json') {
        return response.text().then((text) => {
          if (!text) {
            return {};
          }
          return JSON.parse(text);
        });
      } else {
        return response.text();
      }
    }).then((responseJson) => {
      if (repContextType) {
        if (!responseJson.errno) {
          if (withCache) {
            saveToCache(UserStore.getStore().getToken(), url, responseJson.data);
          }
          resolve(responseJson.data);
        } else {
          console.log(internal.tx('NetworkFailed'));
          console.warn(responseJson.errmsg);
          reject(responseJson.errmsg);
        }
      } else {
        resolve(responseJson);
      }
    }).catch((err) => {
      console.log(internal.tx('NetworkFailed'), url);
      console.error(err);
      reject(internal.tx('NetworkFailed'));
    });
  });
}

export function toQueryString(obj) {
  return obj
    ? Object.keys(obj).sort().map((key) => {
      var val = obj[key];
      if (Array.isArray(val)) {
        return val.sort().map((val2) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`;
        }).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }).join('&')
    : '';
}

export function connectUrl(url, path, args) {
  assert(url);
  assert(path);
  let fullurl = `${url.trimRight('/')}/${path.trimLeft('/')}`;
  if (args) {
    const qs = toQueryString(args);
    if (qs) {
      fullurl = fullurl.trimRight('?').trimRight('&');
      if (fullurl.indexOf('?') > -1) {
        fullurl += `&${qs}`;
      } else {
        fullurl += `?${qs}`;
      }
    }
  }
  return fullurl;
}

// fetch with user token header
export function fetchServer({
  url,
  headers,
  data,
  method = 'get',
  withCache = true,
  withToken = true,
  repContextType = 'json'
}) {
  assert(url);
  const server = ServerStore.getStore().currentServer;

  if (!server || !server.address) {
    throw internal.tx('ServerNotConnected');
  }

  return sendFetch({
    url: connectUrl(server.address, url, (method === 'get'
      ? data
      : '')),
    options: {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method === 'post'
        ? toQueryString(data)
        : undefined
    },
    withCache,
    withToken,
    repContextType
  });

}

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
