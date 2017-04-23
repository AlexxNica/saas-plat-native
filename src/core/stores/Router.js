import assert from 'assert';
import {observable, action} from 'mobx';
import {registerStore} from '../core/Store';
import {tx} from '../utils/internal';

@registerStore('routerStore')
export default class RouterStore {
  @observable currentBundle = null;
  @observable currentRoute = null;
  @observable routes = new Map(); // {path:[{ns,router,handler}]}

  @action removeRoute(ns, name) {
    assert(ns);
    this.routes.forEach((items, path) => {
      const removes = items.filter(item => item.ns === ns && (!name || name === item.name));
      for (const item of removes) {
        items.splice(items.indexOf(item), 1);
        console.log(tx('RouterRemoved'), path, ns, name);
      }
    });
  }

  @action clearRoutes() {
    this.routes.clear();
    console.log(tx('ClearAllRouter'));
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

  addRouteItem(path, ns, name, route, handler) {
    assert(path);
    assert(ns);
    assert(name);
    assert(route);

    let items = this.routes.get(path);
    if (!items) {
      // obser没用，buildroute不会观察改变 items = observable([]);
      items = [];
      this.routes.set(path, items);
    }
    items.push({ns, name, route, handler});
    console.log(tx('RouterAdded'), path, ns, name);

  }

  @action entryBundle(bundle) {
    this.currentBundle = bundle;
  }

  @action entryRoute(route) {
    this.currentRoute = route;
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new RouterStore();
    }
    return this._instance;
  }
}
