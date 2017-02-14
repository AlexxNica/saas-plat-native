import assert from 'assert';
import {observable, action} from 'mobx';
import coreLocales from '../locales';
import i18n from '../core/I18n';
import {registerStore} from '../core/Store';

@registerStore('i18nStore')
export default class I18nStore {
  @observable locales = new Map();

  constructor() {
    // 初始化默认的主题
    for (const name in coreLocales) {
      if (coreLocales.hasOwnProperty(name)) {
        const coreLocale = coreLocales[name];
        let locale = this.locales.get(name);
        if (!locale) {
          locale = observable(new Map());
          this.locales.set(name, locale);
        }
        for (let p in coreLocale) {
          if (coreLocale.hasOwnProperty(p)) {
            locale.set(`core.${p}`, coreLocale[p]);
          }
        }
      }
    }
  }

  @action changeLanguage(lng) {
    i18n.changeLanguage(lng);
  }

  @action get(language, namespace) {
    assert(language);
    assert(namespace);
    return this.locales.has(language) && this.locales.get(language).get(namespace);
  }

  @action addLocale(language, namespace, values) {
    if (typeof language === 'object') {
      const obj = language;
      for (const lang in obj) {
        for (const ns in obj[lang]) {
          this.addLocaleItem(lang, ns, obj[lang][ns]);
        }
      }
    } else {
      this.addLocaleItem(language, namespace, values);
    }
  }

  addLocaleItem(language, namespace, values) {
    assert(language);
    assert(namespace);

    if (this.locales.has(language)) {
      let ns = this.locales.get(language).get(namespace);
      if (!ns) {
        ns = values;
        this.locales.get(language).set(namespace, ns);
      } else {
        for (const p in values) {
          if (values.hasOwnProperty(p)) {
            ns[p] = values[p];
          }
        }
      }
    } else {
      const lang = observable(new Map());
      lang.set(namespace, values);
      this.locales.set(language, lang);
    }
  }

  @action removeLocale(language, namespace) {
    if (namespace && language) {
      if (this.locales.has(language) && this.locales.get(language)[namespace]) {
        delete this.locales.get(language)[namespace];
      }
    } else if (language) {
      if (this.locales.has(language)) {
        this.locales.delete(language);
      }
    }
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new I18nStore();
    }
    return this._instance;
  }
}
