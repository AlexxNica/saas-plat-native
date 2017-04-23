import assert from 'assert';
import {LoadContextManager} from './Context';
import {tx} from '../utils/internal';

export default class {
  static registerModuleInit(name, handler) {
    assert(name, '注册初始化函数必须提供一个名字');
    assert(handler, '初始化函数不能为空');
    try {
      const ctx = LoadContextManager.getCurrentContext();
      ctx.registerModuleInitMethod(name, handler);
      console.log('模块初始化函数注册完成');
    } catch (err) {
      console.log('模块初始哈函数注册失败');
      console.warn(err);
    }
  }

  static removeModuleInit(name) {
    assert(name, '删除初始化函数必须提供一个名字');
    try {
      const ctx = LoadContextManager.getCurrentContext();
      ctx.unregisterModuleInitHandler(name);
      console.log('模块初始化函数删除完成');
    } catch (err) {
      console.log('模块初始化函数删除失败');
      console.warn(err);
    }
  }

  static registerRoute(name, path, route, afterBuild) {
    if (typeof name === 'function' && !route) {
      route = name;
      path = 'portal';
      name = 'default';
    }
    if (typeof path === 'function' && !route) {
      route = path;
      path = 'portal';
    }

    assert(name, '路由名称未定义');
    assert(path, '路由地址未定义');
    assert(typeof route === 'function');

    // let tRoute = route; if (typeof route === 'function') {   route = route(); }
    //
    // checkRoute(route);

    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerRoute(path, name, route, afterBuild); // 注册原始的route，route会根据state变化时动态计算
  }

  static removeRoute(name, path) {
    assert(name, '路由名称未定义');
    if (!path) {
      path = 'portal';
    }

    const ctx = LoadContextManager.getCurrentContext();
    ctx.removeRoute(path, name);
  }

  // name 参数可以是 string 但是必须提供route
  // 可以是 route        可以是 function
  static registerRootRoute(name, route, afterBuild) {
    if (typeof name !== 'string') {
      afterBuild = route;
      route = name;
      name = 'default';
    }
    this.registerRoute(name, '/', route, afterBuild);
  }

  static registerTheme(name, theme) {
    if (arguments.length === 1) {
      theme = name;
      name = 'default';
    }
    assert(name, tx('ThemeNameNull'));
    assert(theme && typeof theme === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerTheme(name, theme);
  }

  static removeTheme(name, ns) {
    assert(name, tx('ThemeNameNull'));
    if (!ns) {
      const ctx = LoadContextManager.getCurrentContext();
      ns = ctx.getCurrentBundleName();
    }
    const ctx = LoadContextManager.getCurrentContext();
    ctx.unregisterTheme(name, ns);
  }

  static registerLocales(lang, locales) {
    if (arguments.length === 1){
      // 默认是简体中文
      locales = lang;
      lang = 'zh-CN';
    }
    assert(locales, tx('LocalesNull'));
    assert(locales && typeof locales === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerLocales(lang, locales);
  }

  static removeLocales(name, ns) {
    assert(name, tx('LocalesNameNull'));
    if (!ns) {
      const ctx = LoadContextManager.getCurrentContext();
      ns = ctx.getCurrentBundleName();
    }
    const ctx = LoadContextManager.getCurrentContext();
    ctx.unregisterLocales(name, ns);
  }

  static registerStore(name, Store, filter, getStoreHandler) {
    if (arguments.length === 1) {
      Store = name;
      name = 'default';
    }
    assert(name);
    assert(Store && typeof Store === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerStore(name, Store, filter, getStoreHandler);
  }

  static removeStore(name, ns) {
    assert(name, tx('StoreNameNull'));
    if (!ns) {
      const ctx = LoadContextManager.getCurrentContext();
      ns = ctx.getCurrentBundleName();
    }
    const ctx = LoadContextManager.getCurrentContext();
    ctx.unregisterStore(name, ns);
  }
}
