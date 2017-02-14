import assert from 'assert';
import React from 'react';

import hook, {HookTypes} from './Hook';

let storeList = [];

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
  return WarpComponent => function StoreBindComponent(props) {
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
      if (WarpComponent.bundleName) {
        matchNames.push(WarpComponent.bundleName.split('.').concat(matchName.split('.')));
        aliasNames.length += 1;
      }
      if (props.bundleName) {
        matchNames.push(props.bundleName.split('.').concat(matchName.split('.')));
        aliasNames.length += 1;
      }
    } else if (Array.isArray(matchName)) {
      matchNames = matchNames.concat(matchName.map(name => name.split('.')));
      aliasNames.length += matchName.length;
    } else if (typeof matchName === 'object') {
      for (const aliasName in matchName) {
        const ClassName = matchName[aliasName];
        if (ClassName) {
          matchNames.push(ClassName.split('.'));
          aliasNames.push(aliasName);
        }
        // 自动补全命名空间
        if (WarpComponent.bundleName) {
          matchNames.push(WarpComponent.bundleName.split('.').concat(ClassName.split('.')));
          aliasNames.push(aliasName);
        }
        if (props.bundleName) {
          matchNames.push(props.bundleName.split('.').concat(ClassName.split('.')));
          aliasNames.push(aliasName);
        }
      }
    }
    const storeProps = getStoreProps(matchNames, props, aliasNames);
    return (
      <WarpComponent {...storeProps} {...props}>
        {props.children}
      </WarpComponent>
    );
  };
}

export function registerStore(storeName, aliasName, filter, getStoreHandler) {
  assert(storeName);
  assert(!filter || typeof filter === 'function');
  assert(!getStoreHandler || typeof getStoreHandler === 'function');

  return Store => {
    storeList.push({
      aliasName: aliasName || storeName,
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
    storeList = storeList.splice(index, 1);
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
