import {observable} from 'mobx';

export default class DeviceModel {
  store;
  id;
  @observable version;
  @observable debug;

  constructor(store, id, version, debug) {
    this.store = store;
    this.id = id;
    this.version = version ;
    this.phone = debug;
  }

  toJS() {
    return {id: this.id, version: this.version, debug: this.debug};
  }

  static fromJS(store, object) {
    return new MessageItemModel(store, object.id, object.version, object.debug);
  }
}
