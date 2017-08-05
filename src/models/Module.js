import {observable, action, computed} from 'mobx';

export default class Module {
  store;
  id;

  @observable name;
  @observable icon;
  @observable text;
  @observable order;
  @observable url;
  @observable isDefault;

  constructor(store, id, url, name, text, icon, order, isDefault) {
    this.store = store;
    this.id = id;
    this.url = url;
    this.text = text;
    this.icon = icon;
    this.name = name;
    this.order = order;
    this.isDefault = isDefault;
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
      icon: this.icon,
      url: this.url,
      order: this.order,
      isDefault: this.isDefault
    };
  }

  static fromJS(store, object) {
    return new Module(store, object.id, object.url, object.name, object.text, object.icon, object.order, object.isDefault);
  }
}
