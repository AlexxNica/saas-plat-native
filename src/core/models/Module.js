import {observable, action, computed} from 'mobx';
import View from './View';

export default class Module {
  store;
  id;

  @observable name;
  @observable text;
  @observable views;

  // 模块的url就是第一个view的url
  @computed get url() {
    if (this.views.length > 0) {
      return this.views[0].url;
    }
    return null;
  }

  constructor(store, id, name, text, views) {
    this.store = store;
    this.id = id;
    this.text = text;
    this.name = name;
    this.views = views || [];
  }

  // 打开模块页面
  @action open(viewName, options) {
    this.store.openModule(this.name, viewName, options);
  }

  toJS() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      url: this.url,
      views: this.views.map(v => v.toJS)
    };
  }

  static fromJS(store, object) {
    return new Module(store, object.id, object.name, object.text, (object.views || []).map(v => View.fromJS(this, this.code, v)));
  }
}
