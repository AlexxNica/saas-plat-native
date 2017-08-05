import {observable, action, computed} from 'mobx';

export default class View {
  store;
  id;
  mId;

  @observable text;
  @observable name;
  @observable config;

  constructor(store, mId, id, name, text, config) {
    this.store = store;
    this.mId = mId;
    this.id = id;
    this.name = name;
    this.text = text;
    this.config = config;
  }

  toJS() {
    return {
      ...this.config,
      id: this.id,
      name: this.name,
      text: this.text
    };
  }

  static fromJS(store,   object) {
    const {
      id,
      mId,
      name,
      text,
      ...config
    } = object;
    return new View(store, mId, id, name, text, config);
  }
}
