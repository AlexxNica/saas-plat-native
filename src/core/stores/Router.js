import assert from 'assert';
import {observable, action} from 'mobx';
import {registerStore} from '../core/Store';

@registerStore('routerStore')
export default class RouterStore {
  @observable currentBundle = null;
  @observable currentScene = null;
  @observable scenes = new Map(); // {path:[{ns,router,handler}]}

  @action removeScene(ns, name) {
    assert(ns, 'ns is null');
    this.scenes.forEach((items, path) => {
      const removes = items.filter(item => item.ns === ns && (!name || name === item.name));
      for (const item of removes) {
        items.splice(items.indexOf(item), 1);
        console.log(`路由${path}:${ns}/${name}已被移除`);
      }
    });
  }

  @action clearScenes() {
    this.scenes.clear();
    console.log('移除所有路由注册');
  }

  @action addScene(path, ns, name, route, handler) {
    if (typeof path === 'object') {
      const obj = path;
      for (const {path, ns, name, route, handler}
      of obj) {
        this.addSceneItem(path, ns, name, route, handler);
      }
    } else {
      this.addSceneItem(path, ns, name, route, handler);
    }
  }

  addSceneItem(path, ns, name, route, handler) {

    assert(path, 'path is null');
    assert(ns, 'ns is null');
    assert(name, 'name is null');
    assert(route, 'route is null');

    let items = this.scenes.get(path);
    if (!items) {
      // obser没用，buildscene不会观察改变 items = observable([]);
      items = [];
      this.scenes.set(path, items);
    }
    // router 无法计算，移到core/router去buildscene
    items.push({ns, name, route, handler});
    console.log(`路由${path}:${ns}/${name}注册完成`);

  }

  @action entryBundle(bundle) {
    this.currentBundle = bundle;
  }

  @action entryScene(scene) {
    this.currentScene = scene;
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new RouterStore();
    }
    return this._instance;
  }
}
