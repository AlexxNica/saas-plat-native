import { Platform } from 'react-native';
import { useStrict } from 'mobx';
useStrict(true);

// utils
import * as helper from './utils/helper';
import * as Asset from './utils/Asset';
import Statistics from './utils/Statistics';
import LocalStore from './utils/LocalStore';

// core
import PlatformApis from './apis/PlatformApis';
import ServerApis from './apis/ServerApis';
import Bundle from './core/Bundle';
import Registry from './core/Registry';
import * as Theme from './core/Theme';
import I18n from './core/I18n';
import * as Store from './core/Store';
import * as Socket from './core/Socket';
import Screen from './core/Screen';
import Startup from './core/Startup';

// fx
import CommandBus from './fx/CommandBus';
import Query from './fx/Query';

// stores
import UserStore from './stores/User';
import SystemStore from './stores/System';
import ThemeStore from './stores/Theme';
import I18nStore from './stores/I18n';
import RouterStore from './stores/Router';
import MessageStore from './stores/Message';
import ServerStore from './stores/Server';
import ModuleStore from './stores/Module';
import ViewStore from './stores/View';

module.exports = {
  UserStore, // 用户参数
  SystemStore, // 系统参数
  ThemeStore, // 主题
  I18nStore, // 多语言
  RouterStore, // 路由
  MessageStore, // 消息服务
  ServerStore,
  ModuleStore,

  // core
  SaasPlat: PlatformApis,
  Server: ServerApis,
  Bundle,
  I18n,
  Theme,
  Store,
  Registry, // 注册模块
  Socket, // 即时通讯
  Screen,
  Platform,
  Startup,

  // fx
  CommandBus,
  Query,

  // utils
  Asset, // 资源
  Statistics, // 统计报表,
  LocalStore, // 本地缓存
  ...helper,
};
