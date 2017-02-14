import {observable} from 'mobx';

export default class OptionModel {
  store;
  @observable items;

  constructor(store, items) {
    this.store = store;
    this.items = items || {};
  }

  toJS() {
    return {items};
  }

  static fromJS(store, object) {
    return new OptionModel(store, object);
  }
}
