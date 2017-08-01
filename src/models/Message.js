import {observable} from 'mobx';

export default class MessageItemModel {
  store;
  @observable title;
  @observable content;
  @observable data;
  @observable receiveDatetime;
  @observable readDatetime;

  constructor(store, title, content, data, receiveDatetime, readDatetime) {
    this.store = store;
    this.title = title;
    this.content = content;
    this.data = data;
    this.receiveDatetime = receiveDatetime;
    this.readDatetime = readDatetime;
  }

  toJS() {
    return {title: this.title, content: this.content, data: this.data, receiveDatetime: this.receiveDatetime, readDatetime: this.readDatetime};
  }

  static fromJS(store, object) {
    return new MessageItemModel(store, object.title, object.content, object.data, object.receiveDatetime, object.readDatetime);
  }
}
