import {I18n} from 'saasplat-native';

let commonLoadLang;
let routerLoadLang;

export function tx(key) {
  if (commonLoadLang !== I18n.language) {
    I18n.loadNamespaces(['platform.portal.common']);
    commonLoadLang = I18n.language;
  }
  return I18n.tx('platform.portal.common', key);
}

export function tr(key) {
  if (routerLoadLang !== I18n.language) {
    I18n.loadNamespaces(['platform.portal.router']);
    routerLoadLang = I18n.language;
  }
  return I18n.tx('platform.portal.router', key);
}
