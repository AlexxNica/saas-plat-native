import {observable} from 'mobx';

export default class ServerModel {
  store;
  @observable id;
  @observable name;
  @observable role;
  @observable ip;
  @observable options;

  constructor(store, id, name, role, ip, options) {
    this.store = store;
    this.id = id;
    this.name = name;
    this.role = role;
    this.ip = ip;
    this.options = options || {};
  }

  toJS() {
    return {id: this.id, name: this.name, role: this.role, ip: this.ip, options: this.options};
  }

  static fromJS(store, object) {
    return new ServerModel(store, object.id, object.name, object.role, object.ip, object.options);
  }
}
