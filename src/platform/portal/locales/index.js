import {Registry} from 'saasplat-native';

import router from './zh-CN/router';
import ServerListLocales from './zh-CN/ServerList';
import NoModuleLocales from './zh-CN/NoModule';
import PortalLocales from './zh-CN/Portal';

Registry.registerLocales('zh-CN', () => ({router, ServerListLocales, NoModuleLocales, PortalLocales}));
