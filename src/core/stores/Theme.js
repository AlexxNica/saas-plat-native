import assert from 'assert';
import {observable, action, computed} from 'mobx';
import coreThemes from '../themes';
import commonThemes from '../themes/common';
import {registerStore} from '../core/Store';

function mapToObj(map) {
  const obj = {};
  map.forEach((item, k) => {
    obj[k] = item;
  });
  return obj;
}

@registerStore('themeStore')
export default class ThemeStore {
  @observable themes = new Map();
  @observable currentThemeName;

  @computed get defaultTheme() {
    return mapToObj(this.themes.get('default'));
  }

  @computed get currentTheme() {
    const defaultTheme = mapToObj(this.themes.get('default'));
    if (this.currentThemeName === 'default') {
      return defaultTheme;
    }
    const currentTheme = mapToObj(this.themes.get(this.currentThemeName));
    return {
      ...defaultTheme,
      ...currentTheme
    };
  }

  createDefaultTheme(ns, defaultThemes) {
    for (const name in defaultThemes) {
      if (defaultThemes.hasOwnProperty(name)) {
        const coreTheme = defaultThemes[name];
        let theme = this.themes.get(name);
        if (!theme) {
          theme = observable(new Map());
          this.themes.set(name, theme);
        }
        for (const p in coreTheme) {
          if (coreTheme.hasOwnProperty(p)) {
            theme.set(`${ns
              ? ns + '.'
              : ''}${p}`, coreTheme[p]);
          }
        }
      }
    }
  }

  constructor() {
    // 初始化默认的主题
    this.createDefaultTheme('core', coreThemes);
    this.createDefaultTheme(null, commonThemes);

    // 当前主题
    this.currentThemeName = 'default';
  }

  @action setTheme(name) {
    assert(name, '主题名称未指定');
    if (!this.themes.get(name)) {
      console.warn(name + '主题不存在');
      return false;
    }
    this.currentThemeName = name;
    return true;
  }

  @action addTheme(name, key, theme) {
    if (typeof name === 'object') {
      const obj = name;
      for (const n in obj) {
        for (const key in obj[n]) {
          this.addThemeItem(n, key, obj[n][key]);
        }
      }
    } else {
      this.addThemeItem(name, key, theme);
    }
  }

  addThemeItem(name, key, theme) {
    assert(name, '主题名称不能为空');
    assert(key, '主题命名空间不能为空');
    let theth = this.themes.get(name);
    if (!theth) {
      theth = observable(new Map());
      this.themes.set(name, theth);
    }
    theth.set(key, theme);
    return true;
  }

  @action removeTheme(name, keys) {
    assert(name, '主题名称不能为空');
    if (!this.themes.get(name)) {
      console.warn(name + '主题不存在');
      return false;
    }
    if (!keys) {
      this.themes.delete(name);
    } else {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      keys.forEach(key => {
        delete this.themes.get(name)[key];
      });
    }
    return true;
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new ThemeStore();
    }
    return this._instance;
  }
}
