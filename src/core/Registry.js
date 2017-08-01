import assert from 'assert';
import {LoadContextManager} from './Context';
import {tx} from '../utils/internal';

LoadContextManager.createContext();

export default class {
  // static registerModuleInit(name, handler) {   assert(name, '注册初始化函数必须提供一个名字');
  //   assert(handler, '初始化函数不能为空');   try {     const ctx =
  // LoadContextManager.getCurrentContext();
  // ctx.registerModuleInitMethod(name, handler);     console.log('模块初始化函数注册完成');
  //  } catch (err) {     console.log('模块初始哈函数注册失败');     console.warn(err);   } }
  //
  // static removeModuleInit(name) {   assert(name, '删除初始化函数必须提供一个名字');   try {
  //  const ctx = LoadContextManager.getCurrentContext();
  // ctx.unregisterModuleInitHandler(name);     console.log('模块初始化函数删除完成');   }
  // catch (err) {     console.log('模块初始化函数删除失败');     console.warn(err);   } }

  static registerRoute(name, path, ns, route, afterBuild) {
    if (arguments.length === 3) {
      afterBuild = arguments[2];
      route = arguments[1];
      ns = arguments[0];
      path = 'portal';
      name = 'default';
    }
    if (arguments.length === 4) {
      afterBuild = arguments[3];
      route = arguments[2];
      ns = arguments[1];
      path = arguments[0];
      name = 'default';
    }

    assert(name, '路由名称未定义');
    assert(path, '路由地址未定义');
    assert(typeof route === 'function');

    // let tRoute = route; if (typeof route === 'function') {   route = route(); }
    //
    // checkRoute(route);

    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerRoute(ns, path, name, route, afterBuild); // 注册原始的route，route会根据state变化时动态计算
  }

  static removeRoute(name, path) {
    assert(name, '路由名称未定义');
    if (!path) {
      path = 'portal';
    }

    const ctx = LoadContextManager.getCurrentContext();
    ctx.removeRoute(path, name);
  }

  // name 参数可以是 string 但是必须提供route 可以是 route        可以是 function
  static registerRootRoute(name, ns, route, afterBuild) {
    if (arguments.length === 3) {
      afterBuild = arguments[2];
      route = arguments[1];
      ns = arguments[0];
      name = 'default';
    }
    if (arguments.length === 2 || arguments.length === 1) {
      afterBuild = arguments[1];
      route = arguments[0];
      ns = '';
      name = 'default';
    }
    this.registerRoute(name, '/', route, afterBuild);
  }

  static registerTheme(name, ns, theme) {
    if (arguments.length === 2) {
      ns = arguments[0];
      theme = arguments[1];
      name = 'default';
    }
    if (arguments.length === 1) {
      ns = '';
      theme = name;
      name = 'default';
    }
    assert(name, tx('ThemeNameNull'));
    assert(theme && typeof theme === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerTheme(ns, name, theme);
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

  static registerLocales(lang, ns, locales) {
    if (arguments.length === 1) {
      // 默认是简体中文
      locales = arguments[0];
      ns = '';
      lang = 'zh-CN';
    }
    if (arguments.length === 2) {
      // 默认是简体中文
      locales = arguments[1];
      ns = arguments[0];
      lang = 'zh-CN';
    }
    assert(locales, tx('LocalesNull'));
    assert(locales && typeof locales === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerLocales(ns, lang, locales);
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

  static registerStore(ns, name, Store, filter, getStoreHandler) {
    if (arguments.length === 1) {
      Store = name;
      ns = '';
      name = 'default';
    }
    assert(name);
    assert(Store && typeof Store === 'function');
    const ctx = LoadContextManager.getCurrentContext();
    ctx.registerStore(ns, name, Store, filter, getStoreHandler);
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
