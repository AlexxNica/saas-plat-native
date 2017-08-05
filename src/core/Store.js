import assert from 'assert';
import React from 'react';

import hook, {HookTypes} from './Hook';

const storeList = [];

export function getStore(Store, getStoreHandler) {
  if (getStoreHandler) {
    return getStoreHandler(Store);
  }
  if (typeof Store.getStore === 'function') {
    return Store.getStore();
  }
  if (!Store.instanceWarp) {
    Store.instanceWarp = new Store();
  }
  return Store.instanceWarp;
}

export function getStoreProps(matchNames, props, aliasNames) {
  const hooks = hook.hooks[HookTypes.connectStore] || [];
  let hookProps = {};
  if (!Array.isArray(matchNames)) {
    matchNames = [matchNames];
  }
  for (const store of storeList) {
    let Store;
    let aliasName;
    for (const matchItem of matchNames) {
      // 每一个matchItem也是一个数组
      if (match(store.storeNames, matchItem)) {
        if (store.filter) {
          if (store.filter(props)) {
            Store = store.Store;
          }
        } else {
          Store = store.Store;
        }
        // 支持自定义别名
        if (Store && aliasNames.length > matchNames.indexOf(matchItem)) {
          aliasName = aliasNames[matchNames.indexOf(matchItem)];
        }
        // 匹配过就跳出
        break;
      }
    }
    if (Store) {
      hookProps[aliasName || store.aliasName || store.storeNames.join('_')] = getStore(Store, store.getStoreHandler);
    }
  }
  hooks.forEach(hook => {
    hookProps = {
      ...hookProps,
      ...hook(props)
    };
  });
  return hookProps;
}

// matchName 支持 * 和 **
//   * 一级任意   ** 多级任意字符
export function connectStore(matchName) {
  const args = arguments;
  return WarpComponent => {
    const StoreBindComponent = function(props) {
      let matchNames = [];
      // 支持自定义别名
      const aliasNames = [];
      if (args.length > 1) {
        // 支持多参数数组
        matchName = args;
      }
      // 支持三种参数形式
      if (typeof matchName === 'string') {
        if (matchName) {
          matchNames.push(matchName.split('.'));
          aliasNames.length += 1;
        }
        // 自动补全命名空间
        if (WarpComponent.$packageName) {
          matchNames.push(WarpComponent.$packageName.split('.').concat(matchName.split('.')));
          aliasNames.length += 1;
        }
        // 添加一个默认平台的命名空间
        matchNames.push(['saas-plat-native'].concat(matchName.split('.')));
        aliasNames.length += 1;
      } else if (Array.isArray(matchName)) {
        matchNames = matchNames.concat(matchName.map(name => name.split('.')));
        aliasNames.length += matchName.length;
        // 自动补全命名空间
        if (WarpComponent.$packageName) {
          matchNames = matchNames.concat(matchName.map(name => WarpComponent.$packageName.split('.').concat(name.split('.'))));
          aliasNames.length += matchName.length;
        }
        // 添加一个默认平台的命名空间
        matchNames = matchNames.concat(matchName.map(name => ['saas-plat-native'].concat(name.split('.'))));
        aliasNames.length += matchName.length;
      } else if (typeof matchName === 'object') {
        for (const aliasName in matchName) {
          const ClassName = matchName[aliasName];
          if (ClassName) {
            matchNames.push(ClassName.split('.'));
            aliasNames.push(aliasName);
          }
          // 自动补全命名空间
          if (WarpComponent.$packageName) {
            matchNames.push(WarpComponent.$packageName.split('.').concat(ClassName.split('.')));
            aliasNames.push(aliasName);
          }
          // 添加一个默认平台的命名空间
          matchNames.push(['saas-plat-native'].concat(ClassName.split('.')));
          aliasNames.push(aliasName);
        }
      }
      const storeProps = getStoreProps(matchNames, props, aliasNames);
      return (
        <WarpComponent {...storeProps} {...props}>
          {props.children}
        </WarpComponent>
      );
    };
    StoreBindComponent.$packageName = WarpComponent.$packageName;
    StoreBindComponent.$packageVersion = WarpComponent.$packageVersion;
    return StoreBindComponent;
  };
}

export function registerStore(storeName, aliasName, filter, getStoreHandler) {
  if (arguments.length === 1) {
    // 如果只有一个参数，默认是别名，类名有.name获取
    aliasName = arguments[0];
  }
  //assert(storeName);
  assert(!filter || typeof filter === 'function');
  assert(!getStoreHandler || typeof getStoreHandler === 'function');

  return Store => {
    if (!storeName && Store.name !== '_default') {
      storeName = (Store.$packageName
        ? (Store.$packageName + '.')
        : '') + Store.name;
    }
    if (!storeName) {
      storeName = aliasName;
    }
    if (!aliasName){
      // 默认别名首字母小写
      aliasName = storeName[0].toLocaleLowerCase() + storeName.substr(1);
    }
    storeList.push({
      aliasName: aliasName,
      storeNames: storeName.split('.'),
      Store,
      filter,
      getStoreHandler
    });
  };
}

export function unregisterStore(storeName) {
  const storeNames = storeName.split('.');
  const removes = storeList.filter(store => match(store.storeNames, storeNames));
  for (const item of removes) {
    const index = storeList.indexOf(item);
    storeList.splice(index, 1);
  }
}

export function match(appNames, matchNames) {
  let matchIndex = 0;
  // **前匹配
  for (let i = 0; i < appNames.length && matchIndex < matchNames.length; i++) {
    if (appNames[i] !== matchNames[i] && matchNames[matchIndex] !== '*' && matchNames[matchIndex] !== '**') {
      return false;
    }
    if (matchNames[matchIndex] !== '**') {
      matchIndex++;
    }
  }
  // 匹配**后匹配
  for (let i = appNames.length, matchIndex = matchNames.length; i > 0 && matchIndex > 0; i--) {
    if (appNames[i] !== matchNames[i] && matchNames[matchIndex] !== '*' && matchNames[matchIndex] !== '**') {
      return false;
    }
    if (matchNames[matchIndex] !== '**') {
      matchIndex--;
    }
  }
  return true;
}
