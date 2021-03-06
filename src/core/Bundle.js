//import {NetInfo} from 'react-native';
//import assert from 'assert';
//import {tx} from '../utils/internal';
//import localStore from '../utils/LocalStore';

import * as Actions from './Context';
import * as Store from './Store';
import Plugin from './Plugin';

import routerStore from '../stores/Router';
import themeStore from '../stores/Theme';
import i18nStore from '../stores/I18n';

// function invoke(script) {
//   'use strict';
//
//   // chrome引擎new function比eval快一倍以上
//   (new Function(script))();
//   // eval(spscript);
// }

class Bundle {
  // installs = new Map(); // 全部安装项
  // loaded = {}; // 已经加载项
  // initMethods = [];
  // preloads = {};
  // dependencies = {
  //   // module: {module: version}
  // };
  // cacheDisable = !!(global.devOptions && global.devOptions.cacheDisable);
  plugins = new Map();

  // getBundle(name) {
  //   assert(name);
  //   return this.installs.get(name);
  // }
  //
  // getDependencies(name) {
  //   assert(name);
  //   return this.dependencies[name] || {};
  // }
  //
  // getPreloads(scope) {
  //   assert(scope);
  //   return this.preloads[scope] || [];
  // }
  //
  // _build() {
  //   this.preloads = {};
  //   this.dependencies = {};
  //   this.installs.forEach((item) => {
  //     const scope = item.scope;
  //     let preloadScope = this.preloads[scope];
  //     if (!preloadScope) {
  //       this.preloads[scope] = preloadScope = [];
  //     }
  //     const module = {
  //       name: item.name,
  //       version: item.version
  //     };
  //     if (item.preload) {
  //       preloadScope.push(module);
  //     }
  //     if (item.dependencies) {
  //       const deps = [];
  //       item.dependencies.forEach((dependency) => {
  //         deps.push(module);
  //       });
  //       if (deps.length > 0) {
  //         this.dependencies[item.name] = deps;
  //       }
  //     }
  //   });
  // }
  //
  // // scope范畴，用户描述元数据的什么时候有效，如果无效需要删除
  // addMetadata(scope, metadatas) {
  //   assert(scope);
  //   if (!metadatas || metadatas.length <= 0) {
  //     return;
  //   }
  //
  //   this.removeMetadata(scope);
  //
  //   for (const metadata of metadatas) {
  //     assert(metadata);
  //     assert(scope);
  //     assert(metadata.name);
  //     // assert(metadata.name.startsWith(scope + '/'), '元数据必须在' + scope + '范畴内');
  //
  //     this.installs.forEach((item) => {
  //       assert(item.name !== metadata.name);
  //     });
  //
  //   }
  //
  //   for (const metadata of metadatas) {
  //     this.installs.set(metadata.name, {
  //       ...metadata,
  //       scope
  //     });
  //   }
  //   this._build();
  //
  // }
  //
  // removeMetadata(scope) {
  //   assert(scope);
  //   const deletes = [];
  //   this.installs.forEach((item, key) => {
  //     if (item.scope === scope) {
  //       deletes.push(key);
  //     }
  //   });
  //   for (const key of deletes) {
  //     this.installs.delete(key);
  //   }
  //   if (deletes.length > 0) {
  //     this._build();
  //     return true;
  //   }
  //   return false;
  // }
  //
  // addInitMethod(ns, name, handler) {
  //   assert(ns);
  //   assert(name);
  //   assert(handler);
  //   console.log(`模块${ns}/${name}初始化函数注册`);
  //   let items = this.initMethods[ns];
  //   if (!items) {
  //     this.initMethods[ns] = items = [];
  //   }
  //   return items.push({name, handler});
  // }
  //
  // removeInitMethod(ns, name) {
  //   assert(ns);
  //   // assert(name, 'name is null'); 把注册后删除的添加到删除列表中，用于刷新注册
  //   let items = this.initMethods[ns];
  //   if (!items) {
  //     this.initMethods[ns] = items = [];
  //   }
  //   for (let i = 0, l = items.length; i < l; i++) {
  //     if (!name || items[i].name === name) {
  //       items.splice(i, 1);
  //       console.log(`模块${ns}/${name}初始函数删除`);
  //       break;
  //     }
  //   }
  //
  // }

  getKeys(ts, itemkeys, ns, name) {
    if (itemkeys) {
      let keys = itemkeys;
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      return keys.map(key => `${ns}.${key}`);
    } else {
      const store = ts[name];
      const keys = [];
      for (const p in store) {
        if (store.hasOwnProperty(p)) {
          if (p.startsWith(`${ns}.`)) {
            keys.push(p);
          }
        }
      }
      return keys;
    }
  }

  addNS(obj, ns) {
    const valobj = {};
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        valobj[`${ns}.${p}`] = obj[p];
      }
    }
    return valobj;
  }

  margeToOne(list, name, obj) {
    if (!list[name]) {
      list[name] = {};
    }
    list[name] = {
      ...list[name],
      ...obj
    };
  }

  exeRegister(actions) {
    // actions.forEach((item) => {   switch (item.action) {     case
    // Actions.UNREGISTER_BUNDLE:       Store.unregisterStore(item.ns.join('.'));
    // Array.from(i18nStore.getStore().locales.keys()).forEach(name => {
    // i18nStore.getStore().removeLocale(name,
    // this.getKeys(i18nStore.getStore().locales, null, item.ns.join('.'), name));
    // });       Array.from(themeStore.getStore().themes.keys()).forEach(name => {
    //     themeStore.getStore().removeTheme(name,
    // this.getKeys(themeStore.getStore().themes, null, item.ns.join('.'), name));
    // });       routerStore.getStore().removeRoute(item.ns.join('/')); // todo
    // 这个函数需要重构到这里       this.removeInitMethod(item.ns.join('.'));       break; case
    // Actions.UNREGISTER_STORE:
    // Store.unregisterStore(item.ns.concat(item.name).join('.'));       break; case
    // Actions.UNREGISTER_ROUTE: routerStore.getStore().removeRoute(item.path,
    // item.name);       break; case Actions.UNREGISTER_INITMETHOD:
    // this.removeInitMethod(item.ns.join('.'), item.name);       break;     case
    // Actions.UNREGISTER_THEME:       themeStore.getStore().removeTheme(item.name,
    // this.getKeys(themeStore.getStore().themes, item.keys, item.ns.join('.'),
    // item.name));       break;     case Actions.UNREGISTER_LOCALES:
    // i18nStore.getStore().removeLocale(item.name,
    // this.getKeys(i18nStore.getStore().locales, item.keys, item.ns.join('.'),
    // item.name));       break;   } }); 合并更新项，减少刷新次数
    const locales = {};
    const themes = {};
    const stores = [];
    const routers = [];
    const methods = [];
    actions.forEach(item => {
      switch (item.action) {
        case Actions.REGISTER_LOCALES:
          this.margeToOne(locales, item.lang, this.addNS(item.locales(), item.ns));
          break;
        case Actions.REGISTER_THEME:
          this.margeToOne(themes, item.name, this.addNS(item.theme(), item.ns));
          break;
        case Actions.REGISTER_STORE:
          const store = item.Store();
          for (const aliasName in store) {
            let name = item.name;
            if (store[aliasName].name !== '_default') {
              name = store[aliasName].name;
            }
            if (!name) {
              name = aliasName;
            }
            stores.push({
              name: item.ns + '.' + name,
              aliasName,
              filter: item.filter,
              getStoreHandler: item.getStoreHandler,
              Class: store[aliasName]
            });
          }
          break;
        case Actions.REGISTER_ROUTE:
          routers.push({path: item.path, ns: item.ns, name: item.name, route: item.route(), handler: item.handler});
          break;
          // case Actions.REGISTER_INITMETHOD:   methods.push({ns: item.ns.join('.'),
          // name: item.name, handler: item.handler});   break;

      }
    });

    i18nStore.getStore().addLocale(locales);
    themeStore.getStore().addTheme(themes);
    stores.forEach(({name, aliasName, filter, getStoreHandler, Class}) => Store.registerStore(name, aliasName, filter, getStoreHandler)(Class));
    routerStore.getStore().addRoute(routers);
    methods.forEach(({ns, name, handler}) => this.addInitMethod(ns, name, handler));

    actions.forEach(item => {
      if (item.action === Actions.REGISTER_ACTIONS) {
        const plu = new Plugin(item.module);
        this.plugins.set(item.token, plu);
        Object.keys(item.actions).forEach(name => {
          plu.subscribe(name, item.actions[name]);
        });
      }
    });
  }

 //  hasLoaded(name, version) {
 //    return this.loaded[name] || false;
 //  }
 //
 //  getDependenciesInternal(item, hasloads) {
 //    const deps = this.getDependencies(item);
 //    for (const depItem in deps) {
 //      let hasLoad = false;
 //      for (const hasItem of hasloads) {
 //        // todo 这里还需要比较版本，版本范围不符合也不能加载
 //        if (depItem.name === hasItem.name) {
 //          hasLoad = true;
 //          break;
 //        }
 //      }
 //      if (hasLoad) {
 //        break;
 //      }
 //      hasloads.push(depItem);
 //      this.getDependenciesInternal(depItem, hasloads);
 //    }
 //  }
 //
 //  register(...bundles) {
 //    const items = bundles.map(item => (typeof(item) === 'string')
 //      ? {
 //        name: item
 //      }
 //      : item);
 //    const ctx = Actions.LoadContextManager.createContext();
 //    for (const item of items) {
 //      const verName = item.name;
 //      ctx.beginRegisterBundle(verName);
 //      // 自动删除之前的注册
 //      try {
 //        ctx.removeBundleRegisters();
 //        // console.log('require ' + verName);
 //        const instance = (this.require || global.require)(verName);
 //        if (!instance) {
 //          debugger;
 //          console.error(`require ${verName} bundle failed.`);
 //        }
 //      } catch (err) {
 //        // console.log('load bundle failed.');
 //        console.warn(err);
 //      } finally {
 //        ctx.complteRegisterBundle();
 //      }
 //    }
 //    return ctx.complateLoad();
 //  }
 //  /*
 // bundles =  [{
 //   name : string,
 //    version : ?string,
 //    file: url string
 //  }]
 //  */
 //  load(bundles) {
 //    assert(bundles);
 //    const me = this;
 //    return new Promise((resolve, reject) => {
 //      const requestCount = bundles.length,
 //        successItems = [];
 //      let successCount = 0,
 //        errorCount = 0,
 //        loadSuccess,
 //        errorCode;
 //
 //      const needloads = [...bundles];
 //      for (const item of bundles) {
 //        me.getDependenciesInternal.bind(me)(item, needloads);
 //      }
 //
 //      if (typeof this.onLoading === 'function') {
 //        const ret = this.onLoading(needloads);
 //        if (ret.ok) {
 //          successItems.push(ret.successItems || []);
 //          return;
 //        }
 //      }
 //
 //      function loadBundles() {
 //        // 全部请求完，按照顺序加载
 //        const regBundles = needloads.filter(item => successItems.indexOf(item) > -1);
 //        const loadSuccess = me.register(...regBundles);
 //        if (!loadSuccess) {
 //          errorCode = tx('包加载失败');
 //        }
 //        return loadSuccess;
 //      }
 //
 //      function checkLoadResult() {
 //        try {
 //          console.log(tx('包加载完成 ') + (successCount + errorCount) + '/' + requestCount);
 //          if (successCount + errorCount === requestCount) {
 //            loadBundles();
 //          }
 //        } catch (err) {
 //          console.warn(err && err.message
 //            ? err.message
 //            : err);
 //        }
 //        if (successCount === requestCount && loadSuccess) {
 //          resolve();
 //        } else if (successCount + errorCount === requestCount) {
 //          reject(errorCode);
 //        }
 //      }
 //
 //      function loadDefine(itemConfig, script) {
 //        // 注入脚本
 //        if (script) {
 //          const vername = itemConfig.name;
 //          let spscript = "spdefine('" + vername + "', function(global, require, module, exports) {\nrequire=global.sprequire;" + script + "\n});";
 //
 //          if (__DEV__) {
 //            spscript += "\n\nconsole.log('运行包" + vername + "');";
 //          }
 //          invoke(spscript);
 //        }
 //
 //        // 不能异步加载，包有依赖关系，需要全部加载完按照顺序加载
 //        successItems.push(itemConfig);
 //        successCount++;
 //      }
 //
 //      function requestUrl(itemConfig) {
 //        // const devStr = __DEV__   ? '&dev=true'   : '';
 //        console.log(`${tx('获取包')}'${itemConfig.name}'...`);
 //        fetch(itemConfig.file).then((response) => {
 //          if (response.ok) {
 //            return response.text();
 //          }
 //          throw new TypeError('Network request failed (' + response.status + ')');
 //        }).then((responseText) => {
 //          console.log(`${tx('加载包')}${itemConfig.name}`);
 //          loadDefine(itemConfig, responseText);
 //          if (itemConfig.version !== 'HEAD') { // 每次加载最新版不保存
 //            localStore.save({
 //              key: 'bundleConfig',
 //              id: itemConfig.name.replace(/_/, ''),
 //              rawData: responseText
 //            });
 //          }
 //          checkLoadResult();
 //        }).catch((error) => {
 //          console.log(`${tx('加载失败')}'${itemConfig.name}'`, itemConfig.file);
 //          console.warn(error);
 //          errorCount++;
 //          errorCode = tx('网络连接失败');
 //          checkLoadResult();
 //        });
 //      }
 //
 //      if (needloads.length <= 0) {
 //        checkLoadResult();
 //        return;
 //      }
 //
 //      // 平台下载
 //      NetInfo.isConnected.fetch().then((isConnected) => {
 //        if (!isConnected) {
 //          // adminBundleLoaded = adminBundleLoadFailed = true;
 //          errorCode = tx('网络连接失败');
 //          errorCount = requestCount;
 //          checkLoadResult();
 //          return;
 //        }
 //        for (let ii = 0; ii < needloads.length; ii++) {
 //          const item = needloads[ii];
 //          // 标记已经加载，防止死循环
 //          const vername = item.name;
 //          me.loaded[vername] = true;
 //          if (__DEV__ || me.cacheDisable) {
 //            requestUrl(item);
 //          } else {
 //            console.log(tx('读取包元数据'));
 //            localStore.load({
 //              key: 'bundleConfig',
 //              // 需要保存服务器地址，要不切换服务器有可能造成加载错误
 //              id: vername.replace(/_/g, '-')
 //            }).then((script) => {
 //              console.log(tx('包元数据加载完成'));
 //              loadDefine(item, script);
 //              checkLoadResult();
 //            }).catch((err) => { // 没有缓冲数据会在catch中返回
 //              if (err && err.name !== 'NotFoundError') {
 //                console.warn(err);
 //              }
 //              console.log(tx('包加载成功'));
 //              requestUrl(item);
 //            });
 //          }
 //        }
 //      });
 //    });
 //  }

}

export default new Bundle();
