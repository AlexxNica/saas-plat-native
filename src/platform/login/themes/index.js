import {Registry} from 'saasplat-native';

import PasswordLogin from './default/PasswordLogin';
import QuickLogin from './default/QuickLogin';

Registry.registerDefaultTheme(() => ({PasswordLogin, QuickLogin}));
