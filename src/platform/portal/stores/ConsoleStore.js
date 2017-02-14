import {Actions} from 'saasplat-native';
import {observable, action, runInAction} from 'mobx';
import assert from 'assert';

export default class ConsoleStore {
  @observable modules = [
    {
      id: 1,
      text: 'aaa'
    }, {
      id: 2,
      text: 'bbb'
    }, {
      id: 4,
      text: 'ccc'
    }
  ];

  static getStore() {
    if (!this._instance) {
      this._instance = new ConsoleStore();
    }
    return this._instance;
  }
}
