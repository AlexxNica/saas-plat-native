import { observable, action } from 'mobx';

export default class View {
  store;
  id;
  mId;

  @observable mode;
  @observable text;
  @observable name;
  @observable config;

  constructor(store, mId, id, name, text, mode, config) {
    this.store = store;
    this.mId = mId;
    this.id = id;
    this.name = name;
    this.text = text;
    this.mode = mode;
    this.config = config;
  }

  toJS() {
    return {
      ...this.config,
      id: this.id,
      name: this.name,
      text: this.text,
      mode: this.mode,
    };
  }

  static fromJS(store, mId, object) {
    const {
      id,
      name,
      text,
      mode,
      ...config
    } = object;
    return new View(store, mId, id, name, text, mode, config);
  }
}
