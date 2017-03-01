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
    if (arguments.length === 1 && typeof viewName === 'object'){
      options = viewName;
      viewName = null;
    }
    this.store.openModule(this.name, viewName, options);
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
      url: this.url,
      views: this.views.map(v => v.toJS)
    };
  }

  static fromJS(store, object) {
    return new Module(store, object.id, object.name, object.text, (object.views || []).map(v => View.fromJS(this, this.name, v)));
  }
}
