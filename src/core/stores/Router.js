import assert from 'assert';
import { observable, action } from 'mobx';
import { registerStore } from '../core/Store';
import { tx } from '../utils/internal';

@registerStore('routerStore')
export default class RouterStore {
  @observable currentBundle = null;
  @observable currentScene = null;
  @observable scenes = new Map(); // {path:[{ns,router,handler}]}

  @action removeScene(ns, name) {
    assert(ns);
    this.scenes.forEach((items, path) => {
      const removes = items.filter(item => item.ns === ns && (!name ||
        name === item.name));
      for (const item of removes) {
        items.splice(items.indexOf(item), 1);
        console.log(tx('RouterRemoved'), path, ns, name);
      }
    });
  }

  @action clearScenes() {
    this.scenes.clear();
    console.log(tx('ClearAllRouter'));
  }

  @action addScene(path, ns, name, route, handler) {
    debugger
    if (typeof path === 'object') {
      const obj = path;
      for (const { path, ns, name, route, handler } of obj) {
        this.addSceneItem(path, ns, name, route, handler);
      }
    } else {
      this.addSceneItem(path, ns, name, route, handler);
    }
  }

  addSceneItem(path, ns, name, route, handler) {
    assert(path);
    assert(ns);
    assert(name);
    assert(route);

    let items = this.scenes.get(path);
    if (!items) {
      // obser没用，buildscene不会观察改变 items = observable([]);
      items = [];
    }
    // router 无法计算，移到core/router去buildscene
    items.push({ ns, name, route, handler });
    this.scenes.set(path, items);
    console.log(tx('RouterAdded'), path, ns, name);

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
