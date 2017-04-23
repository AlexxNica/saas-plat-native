import {Registry} from 'saasplat-native';

import router from './en/router';
import common from './en/common';

import PasswordLoginLocale from './en/PasswordLogin';

export default {
  common,
  router,
  PasswordLoginLocale
};

Registry.registerLocales(() => ({common, router, PasswordLoginLocale}));
