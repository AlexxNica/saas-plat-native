import { observable, action, computed } from 'mobx';
import View from './View';

export default class Module {
  store;
  id;

  @observable name;
  @observable icon;
  @observable text;
  @observable views = [];
  @observable order;
  @observable url;
  @observable defaultViewMode;

  @computed get defaultView() {
    return this.views.find(v => v.mode === this.defaultViewMode);
  }

  @action async loadView(vId, refresh) {
    await this.store.loadView(this.id, vId, refresh);
  }

  @action addView(model) {
    this.views.push(model);
  }

  @action removeView(vId) {
    const view = this.views.find(it => it.id === vId);
    if (!view) {
      return;
    }
    this.views.splice(this.views.indexOf(view), 1);
  }

  constructor(store, id, url, name, text, icon, order, defaultView = 'viewMode', views = []) {
    this.store = store;
    this.id = id;
    this.url = url;
    this.text = text;
    this.icon = icon;
    this.name = name;
    this.order = order;
    this.defaultViewMode = defaultView;
    this.views.push(views);
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
      icon: this.icon,
      url: this.url,
      order: this.order,
      defaultView: this.defaultViewMode,
      views: this.views.map(v => v.toJS)
    };
  }

  static fromJS(store, object) {
    return new Module(store, object.id, object.url, object.name, object.text,
      object.icon,
      object.order, object.defaultView,
      (object.views || []).map(v => View.fromJS(store, object.name, v)));
  }
}
