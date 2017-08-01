import {observable} from 'mobx';
import UserModel from './User';

export default class HistroyModel {
  store;
  @observable items = [];

  constructor(store, items) {
    this.store = store;
    this.items = items || [];
  }

  add(user) {
    let existsHistoryItem = this.items.find((item) => {
      return item.id == user.id;
    });
    if (!existsHistoryItem) {
      this.items.splice(2, this.items.length, user);
    }
  }

  clear() {
    this.items.length = 0;
  }

  toJS() {
    return {
      items: this.items.map(s => s.toJS())
    };
  }

  static fromJS(store, object) {
    return new HistroyModel(store, (object.items || []).map(s => UserModel.fromJS(store, s)));
  }
}
