import {observable, action, runInAction, reaction, computed} from 'mobx';
import assert from 'assert';
import {registerStore} from '../core/Store';
import Screen from '../core/Screen';

import localStore from '../utils/LocalStore';

import ViewModel from '../models/View';

import * as apis from '../apis/PlatformApis';

@registerStore('viewStore')
export default class ViewStore {
  @observable items = [];

  // 加载模块视图定义，mId是过滤权限用
  @action async loadView(name, mId, refresh = false) {
    assert(mId);
    assert(name);
    let data;
    if (refresh || __DEV__) {
      data = await apis.loadView(name, mId);
    } else {
      try {
        data = await localStore.load({
          key: 'userViews' + Screen.size,
          id: mId + '.' + name
        });
      } catch (err) {
        // no cache
        data = await apis.loadView(name, mId);
      }
    }
    runInAction(() => {
      this.addView(ViewModel.fromJS(this, data));
    });
    return true;
  }

  @action addView(view) {
    const exists = this.items.find(it => it.id === view.id);
    if (exists) {
      this.items.splice(this.items.indexOf(exists), 1, view);
    } else {
      this.items.push(view);
    }
  }

  subscribeLocalstorageToStore() {
    reaction(() => this.items.map(it => it.toJS()), json => {
      json.forEach(it => {
        localStore.save({key: 'userOrders', id: it.id, rawData: json});
      });
    });
  }

  static getStore(cachable = true) {
    if (!this._instance) {
      this._instance = new ViewStore();
      if (cachable) {
        this._instance.subscribeLocalstorageToStore();
      }
    }
    return this._instance;
  }
}
