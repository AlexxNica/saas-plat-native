import {observable} from 'mobx';

export default class SupportModel {
  store;
  @observable phone;

  constructor(store, phone) {
    this.store = store;
    this.phone = phone || '13120471934';
  }

  toJS() {
    return {phone: this.phone};
  }

  static fromJS(store, object) {
    return new SupportModel(store, object.phone);
  }
}
