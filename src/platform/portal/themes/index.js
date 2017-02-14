import {Registry} from 'saasplat-native';

import NotFoundTheme from './default/NotFound';
import NoModuleTheme from './default/NoModule';
import ModuleListTheme from './default/ModuleList';
import PortalTheme from './default/Portal';
import ServerListTheme from './default/ServerList';
import ConsoleTheme from './default/Console';

Registry.registerDefaultTheme(() => ({
  PortalTheme,
  NotFoundTheme,
  NoModuleTheme,
  ModuleListTheme,
  ServerListTheme,
  ConsoleTheme
}));
