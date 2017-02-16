import {observable, action} from 'mobx';

export default class View {
  store;
  id;
  mId;

  @observable url;
  @observable text;
  @observable name;
  @observable config;

  constructor(store, mId, id, name, text, url, config) {
    this.store = store;
    this.mId = mId;
    this.id = id;
    this.name = name;
    this.text = text;
    this.url = url;
    this.config = config;
  }

  @action open(options) {
    this.store.openModule(this.mId, this.name, options);
  }

  toJS() {
    return {
      ...this.config,
      id: this.id,
      name: this.name,
      text: this.text,
      url: this.url,
    };
  }

  static fromJS(store, mId, object) {
    const {
      id,
      name,
      text,
      url,
      ...config
    } = object;
    return new View(store, mId, id, name, text, url, config);
  }
}
