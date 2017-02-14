import assert from 'assert';
import bundle from './Bundle';

import {tx} from '../utils/internal';

export const REGISTER_ROUTE = 'REGISTER_ROUTE';
export const UNREGISTER_ROUTE = 'UNREGISTER_ROUTE';
export const REGISTER_LOCALES = 'REGISTER_LOCALES';
export const UNREGISTER_LOCALES = 'UNREGISTER_LOCALES';
export const UNREGISTER_BUNDLE = 'UNREGISTER_BUNDLE';
export const REGISTER_THEME = 'REGISTER_THEME';
export const UNREGISTER_THEME = 'UNREGISTER_THEME';
export const REGISTER_STORE = 'REGISTER_STORE';
export const UNREGISTER_STORE = 'UNREGISTER_STORE';
export const REGISTER_INITMETHOD = 'REGISTER_INITMETHOD';
export const UNREGISTER_INITMETHOD = 'UNREGISTER_INITMETHOD';

class LoadContext {
  constructor() {
    this._actions = [];
  }

  beginRegisterBundle(bundleName) {
    assert(bundleName, tx('BundleNameNull'));
    assert(bundleName.indexOf('\\') === -1, tx('BundleNameNotAllow'));

    this._currentBundleName = bundleName;
    this._currentNS = bundleName.split('/');
  }

  complteRegisterBundle() {
    this._currentBundleName = null;
  }

  getCurrentBundleName() {
    return this._currentBundleName;
  }

  getCurrenBundleNs() {
    return this._currentNS;
  }

  // 移除包内所有注册信息
  removeBundleRegisters() {
    this._actions.push({action: UNREGISTER_BUNDLE, ns: this._currentNS});
  }

  registerTheme(name, theme) {
    this._actions.push({action: REGISTER_THEME, name, theme, ns: this._currentNS});
  }

  unregisterTheme(name, keys, ns) {
    this._actions.push({
      action: UNREGISTER_THEME,
      name,
      keys,
      ns: ns || this._currentBundleName
    });
  }

  registerStore(name, Store, filter, getStoreHandler) {
    this._actions.push({
      action: REGISTER_STORE,
      name,
      Store,
      filter,
      getStoreHandler,
      ns: this._currentNS
    });
  }

  unregisterStore(name, keys, ns) {
    this._actions.push({
      action: UNREGISTER_STORE,
      name,
      keys,
      ns: ns || this._currentBundleName
    });
  }

  registerLocales(lang, locales) {
    this._actions.push({action: REGISTER_LOCALES, lang, locales, ns: this._currentNS});
  }

  unregisterLocales(name, ns) {
    this._actions.push({
      action: UNREGISTER_LOCALES,
      name,
      ns: ns || this._currentBundleName
    });
  }

  registerRoute(path, name, route, handler) {
    this._actions.push({
      action: REGISTER_ROUTE,
      ns: this._currentNS,
      path,
      name,
      route,
      handler
    });
  }

  removeRoute(path, name) {
    this._actions.push({action: UNREGISTER_ROUTE, ns: this._currentNS, path, name});
  }

  registerModuleInitMethod(name, handler) {
    this._actions.push({action: REGISTER_INITMETHOD, ns: this._currentNS, name, handler});
  }

  removeModuleInit(name) {
    this._actions.push({action: UNREGISTER_INITMETHOD, ns: this._currentNS, name});
  }

  complateLoad() {
    try {
      bundle.register(this._actions);
      this._actions.length = 0;
      this._isComplated = true;
      LoadContextManager.destroyCurrentContext();
      console.log(tx('ModuleInstallComplate'));
      return true;
    } catch (err) {
      LoadContextManager.destroyCurrentContext();
      console.log(tx('ModuleInstallFailed'));
      console.warn(err);
      return false;
    }
  }
}

class LoadContextManager {
  static createContext() {
    const ctx = new LoadContext();
    this.currentContext = ctx;
    return ctx;
  }

  static getCurrentContext() {
    if (!this.currentContext) {
      console.warn(tx('ContextNotExists'));
      return null;
    }
    return this.currentContext;
  }

  static destroyCurrentContext() {
    this.currentContext = null;
  }
}

export {LoadContext, LoadContextManager};
