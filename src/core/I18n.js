import React from 'react';
import { Platform } from 'react-native';
import assert from 'assert';
import i18next from 'i18next';
import * as i18nextReact from 'react-i18next';
import { tx } from '../utils/internal';

let LngDetector;

switch (Platform.OS) {
  case 'android':
  case 'ios':
    LngDetector = require('i18next-react-native-language-detector');
    break;
  case 'web':
    LngDetector = require('i18next-browser-languagedetector');
    break;
  case 'windows':
  case 'macos':
  default:
    console.error(tx('尚未支持的平台语言'), Platform.OS);
}

// ********************* StoreBackend **************************

function getDefaults() {
  return { store: null };
}

class StoreBackend {
  constructor(services, options = {}) {
    this.init(services, options);

    this.type = 'backend';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = {
      ...getDefaults(),
      ...this.options,
      ...options
    };
  }

  formatLang(language) {
    // zh-Hans-CN
    if (language && language.indexOf('-Hans-')) {
      language = language.replace('-Hans-', '-');
    } else if (language && language.indexOf('-Hant-')) {
      language = language.replace('-Hant-', '-');
    } else if (language && language.indexOf('-CHS-')) {
      language = language.replace('-CHS-', '-');
    } else if (language && language.indexOf('-CHT-')) {
      language = language.replace('-CHT-', '-');
    }
    return language;
  }

  read(language, namespace, callback) {
    if (!this.options.store) {
      return callback(tx('StoreOptionNotSet'), false);
    }
    language = this.formatLang(language);
    try {
      callback(null, this.options.store.get(language, namespace));
    } catch (err) {
      callback(err, false);
    }
  }

  create(languages, namespace, key, fallbackValue) {
    console.warn(
      `${languages}${tx('Lang')}${namespace}${tx('LangNeed')}${key}${tx('LangDefine')}`
    );
  }
}

StoreBackend.type = 'backend';

// ********************* MemoryCache **************************

function getDefaults() {
  return { enabled: false };
}

class MemoryCache {
  store;

  constructor(services, options = {}) {
    this.init(services, options);
    this.type = 'cache';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = {
      ...options,
      ...this.options,
      ...getDefaults()
    };
  }

  load(lngs, callback) {
    callback(null, this.store);
  }

  save(store) {
    this.store = store;
  }
}

MemoryCache.type = 'cache';

// **************** config *****************************

i18next.use(MemoryCache).use(StoreBackend).use(LngDetector);

i18next.tx = (ns, key, lng) => {
  if (typeof ns === 'string') {
    ns = [ns];
  }
  return i18next.t(key, { ns, lng });
};

export function translate(ns) {
  if (!Array.isArray(ns)) {
    ns = [ns];
  }
  return (WarppedComponent) => {
    const TranslateComponent = class extends React.Component {
      render() {
        // debugger;
        const props = this.props;
        let TranslatedComponent;
        if (this.translatedComponent) {
          TranslatedComponent = this.translatedComponent;
        } else {
          if (WarppedComponent.$packageName && !ns.find(item => item.startsWith(
              `${WarppedComponent.$packageName}.`))) {
            ns = ns.map(item => `${WarppedComponent.$packageName}.${item}`);
          }
          assert(ns.length > 0);
          // StoreBackend为同步加载，所以直接wait即可
          TranslatedComponent = i18nextReact.translate(ns, { wait: true })
            (
              WarppedComponent);
          this.translatedComponent = TranslatedComponent;
        }
        return <TranslatedComponent {...props}/>;
      }
    };
    TranslateComponent.$packageName = WarppedComponent.$packageName;
    TranslateComponent.$packageVersion = WarppedComponent.$packageVersion;
    return TranslateComponent;
  }
}

export default i18next;
