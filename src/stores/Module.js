import { observable, action, runInAction } from 'mobx';
import assert from 'assert';
import { registerStore } from '../core/Store';

import ModuleModel from '../models/Module';
import ViewModel from '../models/View';

import * as apis from '../apis/PlatformApis';

@registerStore('moduleStore')
export default class ModuleStore {
  @observable modules;

  // 加载用户模块数
  @action async loadModules(refresh = false) {
    if (this.modules && !refresh) {
      return;
    }
    const data = await apis.loadModules();
    runInAction(() => {
      this.modules = data.map(it => ModuleModel.fromJS(it));
    });
  }

  // 加载模块视图定义
  @action async loadView(mId, vId, refresh = false) {
    assert(mId);
    assert(vId);
    const module = this.modules.find(it => it.id === mId);
    if (!module) {
      return false;
    }
    const view = module.views && module.views.find(it => it.id === vId);
    if (!refresh && view) {
      return true;
    }
    const data = await apis.loadView(module.id, vId);
    module.addView(ViewModel.fromJS(this, module.id, data));
    return true;
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

  static getStore() {
    if (!this._instance) {
      this._instance = new ModuleStore();
    }
    return this._instance;
  }
}
