import {observable, action} from 'mobx';
import SupportModel from '../models/Support';
import DeviceModel from '../models/Device';

import bundle from '../core/Bundle';

import {tx} from '../utils/internal';
import localStore from '../utils/LocalStore';

import config from '../config';
import {registerStore} from '../core/Store';

console.disableDebugging = function() {
  SystemStore.getStore().device.debug = false;
};

@registerStore('systemStore')
export default class SystemStore {
  @observable device = new DeviceModel();
  @observable support = new SupportModel();
  @observable options = {};
  @observable config = config;

  @action loadSystemOptions(autoLoad = true) {
    const me = this;
    return new Promise((resolve, reject) => {
      localStore.load({key: 'systemOptions'}).then(result => {
        console.log(tx('SystemOptionLoaded'));
        if (autoLoad) {
          me.options = result;
        }
        resolve(result);
      }).catch(err => {
        if (err && err.name !== 'NotFoundError' && err.name !== 'ExpiredError') {
          console.log(tx('SystemOptionLoadFail'));
          console.warn(err);
          reject();
        } else {
          if (autoLoad) {
            me.options = {};
          }
          resolve({});
        }
      });
    });
  }

  @action saveSystemOptions() {
    console.log('保存系统选项');
    localStore.save({key: 'systemOptions', rawData: this.options});
  }

  @action setSystemOption(options) {
    this.options = {
      ...this.options,
      ...options
    };
    this.saveSystemOptions();
  }

  @action debug(enable = true) {
    this.device.debug = enable;
    if (this.enable && this.options) {
      // 设置调试选项
      bundle.cacheDisable(!!this.options.cacheDisable);
    }
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new SystemStore();
    }
    return this._instance;
  }
}
