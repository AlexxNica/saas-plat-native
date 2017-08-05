import {observable, action, runInAction, reaction, computed} from 'mobx';
import {registerStore} from '../core/Store';
import Screen from '../core/Screen';

import localStore from '../utils/LocalStore';

import ModuleModel, {View as ViewModel} from '../models/Module';

import * as apis from '../apis/PlatformApis';

@registerStore('moduleStore')
export default class ModuleStore {
  @observable modules = [];
  @observable loaded = false;

  @computed get defaultModule() {
    return this.modules.find(it => it.isDefault) || this.modules[0] || null;
  }

  // 加载用户模块数
  @action async loadModules(refresh = false) {
    if (this.loaded && !refresh) {
      return;
    }
    let data;
    if (refresh || __DEV__) {
      data = await apis.loadModules();
    } else {
      try {
        data = await localStore.load({
          key: 'userModules' + Screen.size
        });
      } catch (err) {
        // no cache
        data = await apis.loadModules();
      }
    }
    //data = await apis.loadModules();
    runInAction(() => {
      this.modules.replace((data || []).map(it => ModuleModel.fromJS(this, it)));
      this.loaded = true;
    });
  }



  @action addModule(data) {
    if (!this.modules) {
      this.modules = [];
    }
    this.modules.push(ModuleModel.fromJS(data));
  }

  @action removeModule(id) {
    if (!this.modules) {
      return;
    }
    const exists = this.modules.find(it => it.id === id);
    if (!exists) {
      return;
    }
    this.modules.splice(this.modules.indexOf(exists), 1);
  }

  subscribeLocalstorageToStore() {
    reaction(() => this.modules.map(it => it.toJS()), json => localStore.save({
      key: 'userModules' + Screen.size,
      rawData: json
    }));
  }

  static getStore(cachable = true) {
    if (!this._instance) {
      this._instance = new ModuleStore();
      if (cachable) {
        this._instance.subscribeLocalstorageToStore();
      }
    }
    return this._instance;
  }
}
