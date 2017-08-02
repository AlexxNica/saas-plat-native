import assert from 'assert';
import { LoadContextManager } from './Context'; 

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

    assert(ns);
    assert(name);
    assert(path);
    assert(typeof route === 'function');

    // let tRoute = route; if (typeof route === 'function') {   route = route(); }
    //
    // checkRoute(route);

    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.registerRoute(ns, path, name, route, afterBuild); // 注册原始的route，route会根据state变化时动态计算
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static removeRoute(name, path) {
    assert(name);
    if (!path) {
      path = 'portal';
    }

    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.removeRoute(path, name);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  // name 参数可以是 string 但是必须提供route 可以是 route        可以是 function
  static registerRootRoute(name, ns, route, afterBuild) {
    if (arguments.length === 2 || arguments.length === 3) {
      afterBuild = arguments[2];
      route = arguments[1];
      ns = arguments[0];
      name = 'default';
    }
 
    this.registerRoute(name, '/', ns, route, afterBuild);
  }

  static registerTheme(name, ns, theme) {
    if (arguments.length === 2) {
      ns = arguments[0];
      theme = arguments[1];
      name = 'default';
    }
 
    assert(ns);
    assert(name);
    assert(theme && typeof theme === 'function');
    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.registerTheme(ns, name, theme);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static removeTheme(name, ns) {
    assert(ns);
    assert(name);
    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.unregisterTheme(name, ns);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static registerLocales(lang, ns, locales) {
 
    if (arguments.length === 2) {
      // 默认是简体中文
      locales = arguments[1];
      ns = arguments[0];
      lang = 'zh-CN';
    }
    assert(ns);
    assert(locales);
    assert(locales && typeof locales === 'function');
    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.registerLocales(ns, lang, locales);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static removeLocales(name, ns) {
    assert(ns);
    assert(name);

    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.unregisterLocales(name, ns);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static registerStore(ns, name, Store, filter, getStoreHandler) {
    if (arguments.length === 2) {
      Store = name;
      name = 'default';
    }
    assert(name);
    assert(ns);
    assert(Store && typeof Store === 'function');
    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.registerStore(ns, name, Store, filter, getStoreHandler);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }

  static removeStore(name, ns) {
    assert(ns);
    assert(name);
    let ctx = LoadContextManager.getCurrentContext();
    const createCtx = ctx === null;
    if (createCtx) {
      ctx = LoadContextManager.createContext();
    }
    ctx.unregisterStore(name, ns);
    if (createCtx) {
      ctx.complateLoad();
      LoadContextManager.destroyCurrentContext();
    }
  }
}
