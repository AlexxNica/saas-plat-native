import {observable, action, computed} from 'mobx';

export class View {
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
      mode: this.mode
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

export default class Module {
  store;
  id;

  @observable name;
  @observable icon;
  @observable text;
  @observable views = [];
  @observable order;
  @observable url;
  @observable isDefault;
  @observable defaultViewMode;

  @computed get defaultView() {
    return this.views.find(v => v.mode === this.defaultViewMode);
  }

  @action async loadViews(refresh) {
    await this.store.loadViews(this.id, refresh);
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

  constructor(store, id, url, name, text, icon, order, isDefault, defaultView = 'viewMode', views = []) {
    this.store = store;
    this.id = id;
    this.url = url;
    this.text = text;
    this.icon = icon;
    this.name = name;
    this.order = order;
    this.isDefault = isDefault;
    this.defaultViewMode = defaultView;
    this.views.replace(views);
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
      icon: this.icon,
      url: this.url,
      order: this.order,
      isDefault: this.isDefault,
      defaultView: this.defaultViewMode,
      views: this.views.map(v => v.toJS())
    };
  }

  static fromJS(store, object) {
    return new Module(store, object.id, object.url, object.name, object.text, object.icon, object.order, object.isDefault, object.defaultView, (object.views || []).map(v => View.fromJS(store, object.name, v)));
  }
}
