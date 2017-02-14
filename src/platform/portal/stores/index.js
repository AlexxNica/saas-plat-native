import {Registry} from 'saasplat-native';

import ServerListStore from './ServerListStore';
import ConsoleStore from './ConsoleStore';

Registry.registerStore(() => ({ServerListStore, ConsoleStore}));
