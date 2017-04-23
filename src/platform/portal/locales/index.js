import {Registry} from 'saasplat-native';

import router from './en/router';
import ServerListLocales from './en/ServerList';
import NoModuleLocales from './en/NoModule';
import PortalLocales from './en/Portal';

Registry.registerLocales(() => ({router, ServerListLocales, NoModuleLocales, PortalLocales}));
