import assert from 'assert';
import i18n from '../core/I18n';

let coreCommonLoadLang;

export const tx = (key) => {
  // 如果切换了语言或者没有加载过，加载一次
  if (coreCommonLoadLang !== i18n.language) {
    i18n.loadNamespaces(['core.common']);
    coreCommonLoadLang = i18n.language;
  }
  return i18n.tx('core.common', key);
};

export function trimEnd(txt, trimTxt) {
  assert(txt);
  assert(trimTxt);
  if (txt.endsWith(trimTxt)) {
    return txt.substr(0, txt.length - 1);
  }
  return txt;
}

export function fixStart(txt, fixTxt) {
  assert(txt);
  assert(fixTxt);
  return txt.startsWith(fixTxt) ? txt : `${fixTxt}${txt}`;
}
