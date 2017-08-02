import assert from 'assert';
import {observable, action} from 'mobx';
import {registerStore} from '../core/Store';
import Router from '../core/Router';
import {tx, trimEnd, fixStart} from '../utils/internal';

@registerStore('routerStore')
export default class RouterStore {
  @observable bundleRoutes = new Map(); // {path:[{ns,scope,name,route:[{path,component,...}],handler}]}

  getRoutes(path = '/') {
    let routes = [];
    (this.bundleRoutes.get(path) || []).forEach(item => {
      routes = routes.concat((item.route).map(p => ({
        ...p,
        ns: item.ns,
        //version: item.version,
        path: trimEnd(fixStart(p.path, '/'), '/')  // item.parent + trimEnd(fixStart(p.path, '/'), '/')
      })));
    });
    return routes;
  }

  @action removeRoute(ns, name) {
    assert(ns);
    this.bundleRoutes.forEach((items, path) => {
      const removes = items.filter(item => item.ns === ns && (!name || name === item.name));
      for (const item of removes) {
        items.splice(items.indexOf(item), 1);
        console.log(tx('路由已被移除'), path, ns, name);
      }
    });
  }

  @action clearRoutes() {
    this.bundleRoutes.clear();
    console.log(tx('移除所有路由注册'));
  }

  @action addRoute(path, ns, name, route, handler) {
    if (typeof path === 'object') {
      const obj = path;
      for (const {path, ns, name, route, handler}
      of obj) {
        this.addRouteItem(path, ns, name, route, handler);
      }
    } else {
      this.addRouteItem(path, ns, name, route, handler);
    }
  }

  @action addRouteItem(path, ns, name, route, handler) {
    assert(path);
    assert(ns);
    assert(name);
    assert(route && route.length > 0);

    let items = this.bundleRoutes.get(path);
    if (!items) {
      // obser没用，buildroute不会观察改变
      items = observable([]);
      //items = [];
      this.bundleRoutes.set(path, items);
    }
    items.push({
      ns,
      parent: trimEnd(Router.getPath(ns) || '', '/'),
      name,
      route,
      handler
    });
    console.log(tx('注册路由'), path, ns, name);
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new RouterStore();
    }
    return this._instance;
  }
}
