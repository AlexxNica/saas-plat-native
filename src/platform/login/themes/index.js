import {Registry} from 'saasplat-native';

import PasswordLogin from './default/PasswordLogin';
import QuickLogin from './default/QuickLogin';

import Login from './default/Login';

Registry.registerTheme(() => ({Login, PasswordLogin, QuickLogin}));
