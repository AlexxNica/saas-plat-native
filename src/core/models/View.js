import {observable, action} from 'mobx';

export default class View {
  store;
  id;
  mId;

  @observable url;
  @observable name;
  @observable code;
  @observable config;

  constructor(store, mId, id, code, name, url, config) {
    this.store = store;
    this.mId = mId;
    this.id = id;
    this.code = code;
    this.name = name;
    this.url = url;
    this.config = config;
  }

  @action open(options) {
    this.store.openModule(this.mId, this.code, options);
  }

  toJS() {
    return {
      ...this.config,
      id: this.id,
      code: this.code,
      name: this.name,
      url: this.url,
    };
  }

  static fromJS(store, mId, object) {
    const {
      id,
      code,
      name,
      url,
      ...config
    } = object;
    return new View(store, mId, id, code, name, url, config);
  }
}
