import i18n from '../core/I18n';

let coreCommonLoadLang;

export const tx = (key) => {
  // 如果切换了语言或者没有加载过，加载一次
  if (coreCommonLoadLang != i18n.language) {
    i18n.loadNamespaces(['core.common']);
    coreCommonLoadLang = i18n.language;
  }
  return i18n.tx('core.common', key);
};
